#!/bin/bash

# Skrypt sprawdza co pół godziny czy nastąpiły jakieś zmiany,
# jeśli tak to pobiera na nowo dane

OUTPUT_FILE="/data/dane.csv"
LAST_UPDATE="/data/last_update.txt"
COOLDOWN=3600

while true; do

        echo "Odczytywanie ostatniej aktualizacji"
        SAVED_DATE=$(cat "$LAST_UPDATE")
        CURRENT_LAST_UPDATE=$(curl -s https://plany.ubb.edu.pl/right_menu.php# -H 'User-Agent: Mozilla/5.0' --compressed | sed -n 's/.*Aktualizacja bazy: \([0-9\-]\+ [0-9:]\+\).*/\1/p')

        if [ -f "$OUTPUT_FILE" ]; then

                if [[ -z "$CURRENT_LAST_UPDATE" ]]; then
                        echo "Błąd: Nie udało się pobrać daty aktualizacji."
                        sleep $COOLDOWN
                        continue
                fi

                if [[ "$SAVED_DATE" == "$CURRENT_LAST_UPDATE" ]]; then
                        echo "Ostatnia aktualiacja bez zmian"
                        sleep $COOLDOWN
                        continue
                fi
                echo "Ostatnia aktualizacja została zmieniona. Pobieram dane..."
        else
                echo "Brak pliku $OUTPUT_FILE. Pobieram dane..."
        fi

        TEMP_FILE=$(mktemp)
        trap 'rm -f "$TEMP_FILE"' EXIT

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

                        # wyciągnięcie legendy
                        legend=$(echo "$page" | tr '\n' ' ' | perl -lne "print \$1 if /(<div class=\"data\">.*?<img src=\"images\\/resize\\.png\".*?<\\/div>)/")

                        # rozbicie strony na bloki, które zawierają tylko jakieś przedmioty
                        blocks=$(echo "$page" | tr '\n' ' ' | sed 's/<\/div>/<\/div>\n/g' | grep '<div id="course_')

                        # wyciągamy z bloków nazwę przedmiotu oraz kierunek i zapisujemy razem z nazwą nauczyciela do pliku temp
                        echo "$blocks" | while IFS= read -r block; do
                                course_info=$(echo "$block" | sed -n 's/.*<img[^>]*>\([^<]*\)<br.*/\1/p' | sed 's/[[:space:]]//g')
                                course_code=$(echo "$course_info" | cut -d',' -f1)
                                course_type=$(echo "$course_info" | cut -d',' -f2)

                                major=$(echo "$block" | sed -n 's/.*<a href[^>]*>\([^/<]*\)\/.*/\1/p')
                                if [ -n "$course_info" ] && [ -n "$major" ]; then
                                        course_name=$(echo "$legend" | perl -lne "my \$code = quotemeta(\"$course_code\"); print \$1 if /<strong>\$code<\/strong>\\s*-\\s*(.+?)(?:,|<)/")
                                        course_name="${course_name:-$course_code}"

                                        echo "$major,$course_name,$course_type,$teacher_name" >> "$TEMP_FILE"
                                fi
                        done
                done
        done

        # usuwanie duplikatów
        echo "Major,Subject,Type,Teacher" > "$OUTPUT_FILE"
        sort -u "$TEMP_FILE" >> "$OUTPUT_FILE"
        rm "$TEMP_FILE"

        COUNT=$(($(wc -l < "$OUTPUT_FILE") - 1))

        echo "Dane zapisane do $OUTPUT_FILE. Liczba znalezionych rekordów: $COUNT."
        echo "$CURRENT_LAST_UPDATE" > "$LAST_UPDATE"
        sleep $COOLDOWN

done
