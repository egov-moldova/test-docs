# Pasul de achitare a serviciului

Acest pas intervine **după confirmarea datelor** și este activ doar dacă serviciul necesită achitare. Există situații în care anumite servicii sunt oferite **gratuit**, caz în care acest pas este omis automat.

## Redirecționarea către MPay

Dacă serviciul necesită plată, utilizatorul este **redirecționat către portalul MPay** pentru a efectua achitarea. MPay este platforma guvernamentală unificată pentru plăți online.

> 🔄 Redirecționarea este automată și face parte din procesul standard integrat de FOD pentru plăți.

## Situații particulare

* **Prestatorii cu integrare proprie în MPay**:

  * Dacă solicitarea este procesată într-un **backoffice extern**, **Frontoffice-ul NU trebuie să fie integrat cu MPay**;
  * În acest caz, dezvoltatorul trebuie să se asigure că **redirecționarea către MPay** include toate **numerele comenzilor** relevante (ex: solicitare de bază, apostilare, livrare) pentru ca MPay să genereze o **singură notă de plată**.

* **Procesarea plății de către Frontoffice**:

  * În acest caz, către MPay se va transmite **numărul solicitării FOD**;

* **Procesarea plății de către sistemul prestatorului**:

  * Se va transmite către MPay **numărul de înregistrare** al solicitării în sistemul prestatorului de servicii.

## Responsabilitatea dezvoltatorului

* Asigurarea unei redirecționări corecte către MPay cu toate datele necesare;
* Verificarea că se utilizează corect identificatorii în funcție de cine gestionează plata (FOD vs. sistemul prestatorului);
* Gestionarea corectă a întoarcerii utilizatorului în aplicație după finalizarea plății.

> 💳 Acest pas este esențial pentru finalizarea cu succes a serviciilor contra cost și trebuie să asigure o experiență coerentă și sigură pentru utilizator.

---

Pasul de achitare centralizează toate taxele într-o singură tranzacție și permite integrarea flexibilă cu sistemele de plată guvernamentale existente.
