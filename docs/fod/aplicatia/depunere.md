# Depunerea unei solicitări

Depunerea unei solicitări este cea mai utilizată funcționalitate a Frontoffice-ului și constă în **colectarea datelor de la solicitant** necesare prestării unui anumit serviciu.

> ⚠️ Este esențial ca datele colectate să fie **doar cele strict necesare**. Nu se recomandă colectarea de informații ce pot fi obținute din alte surse oficiale (ex: datele cu caracter personal disponibile dezvoltatorului prin autentificare sau integrare cu registre naționale).

Pe baza experienței acumulate în dezvoltarea mai multor servicii, au fost identificate **mai multe etape** prin care trebuie să treacă solicitantul în cadrul procesului de depunere. Pentru fiecare etapă, au fost dezvoltate **componente specializate**, grupate în cadrul unui **comportament de tip Wizard** (asistent pas-cu-pas).

Această structurare are impact atât la nivel **funcțional**, cât și **tehnic**, deoarece impune:

* Un flux clar de colectare a datelor;
* Un mecanism de validare progresivă;
* Afișarea clară a fiecărei etape pentru utilizator.

### Exemple de etape posibile în procesul de depunere:

* Identificarea solicitantului (opțional, dacă este necesară autentificarea);
* Alegerea serviciului sau sub-tipului de solicitare;
* Completarea formularului de date;
* Încărcarea documentelor justificative;
* Confirmarea și transmiterea solicitării.

Fiecare pas este reprezentat printr-o secțiune distinctă în cadrul componentei Wizard, ceea ce oferă o experiență structurată și ușor de urmărit pentru utilizator.

> 💡 În cadrul serviciilor deja implementate, această funcționalitate este una dintre cele mai critice și vizibile, iar adaptarea fluxului la nevoile reale ale serviciului este esențială pentru succesul implementării.
