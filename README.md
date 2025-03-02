Uruchamianie kontenerów docker

Wymagania:
Docker

Aby zbudować i uruchomić wszystkie kontenery wpisujemy z głównego folderu:
```bash
  docker-compose up --build
```


Strona powinna być dostępna na http://localhost:3000/

Aby je wyłączyć:
```bash
  docker-compose down
```

Nie będę rozpisywał wszystkich dockerowych poleceń, możecie wszystko podpatrzeć z Docker Desktop

Dane ze scrapera są zapisywane w /data/dane.csv



Jak robicie zmiany w aplikacji to wystarczy zbudować sam kontener webservices i zrobić restart w następujący sposób:
```bash
    docker-compose up --build webservices
```
Możecie podpatrzeć zawartość /data/dane.csv w zakładce "Volumes" na Docker Desktop