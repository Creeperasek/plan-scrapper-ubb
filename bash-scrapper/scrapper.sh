#!/bin/bash

# Przy okazji researchu zrobiłem prosty skrypt bash,
# który scrapuje wszystkich pracowników WBMiI,
# przyda się do zapoznania ze strukturą strony

OUTPUT_FILE="dane.csv"
TEMP_FILE=$(mktemp)

# ID WBMiI, pobiera listę ID katedr
BRANCH_LIST="https://plany.ubb.edu.pl/left_menu_feed.php?type=2&branch=6168&link=0"
BRANCH_IDs=$(curl -s "$BRANCH_LIST" -H 'User-Agent: Mozilla/5.0' --compressed | grep -o 'div_[0-9]\+' | sed 's/div_//')

# wszystkie katedry w pętli
for BRANCH_ID in $BRANCH_IDs; do

	TEACHER_LIST_URL="https://plany.ubb.edu.pl/left_menu_feed.php?type=2&branch=${BRANCH_ID}&link=0&bOne=1&iPos=NaN"

	# pobiera listę nauczycieli i wyciąga ID
	teacher_ids=$(curl -s "$TEACHER_LIST_URL" -X POST -H 'User-Agent: Mozilla/5.0' \
		--compressed | grep -o 'plan.php?type=10&amp;id=[0-9]*' | sed 's/.*id=//')


	# dla każdego znalezionego ID
	for tid in $teacher_ids; do

		# pobiera stronę z planem dla danego ID
		PLAN_URL="https://plany.ubb.edu.pl/plan.php?type=10&id=${tid}&winW=1920&winH=1080&loadBG=000000"
		page=$(curl -s "$PLAN_URL" -H 'User-Agent: Mozilla/5.0' --compressed)
		
		
		# pobiera nazwę nauczyciela dla danego ID
		teacher_name=$(echo "$page" | sed -n 's/.*Plan zajęć - \(.*\), tydzień.*/\1/p')

		# rozbicie strony na bloki, które zawierają tylko jakieś przedmioty
		blocks=$(echo "$page" | tr '\n' ' ' | sed 's/<\/div>/<\/div>\n/g' | grep '<div id="course_')

		# wyciągamy z bloków nazwę przedmiotu oraz kierunek i zapisujemy razem z nazwą nauczyciela do pliku temp
		echo "$blocks" | while IFS= read -r block; do
			 course_info=$(echo "$block" | sed -n 's/.*<img[^>]*>\([^<]*\)<br.*/\1/p' | sed 's/[[:space:]]//g')
			 major=$(echo "$block" | sed -n 's/.*<a href[^>]*>\([^/<]*\)\/.*/\1/p')
			 if [ -n "$course_info" ] && [ -n "$major" ]; then
				 echo "$major,$course_info,$teacher_name" >> "$TEMP_FILE"
			 fi
		done
	done
done

# usuwanie duplikatów
echo "Major,Subject,Type,Teacher" > "$OUTPUT_FILE"
sort -u "$TEMP_FILE" >> "$OUTPUT_FILE"
rm "$TEMP_FILE"

echo "Dane zapisane do $OUTPUT_FILE"