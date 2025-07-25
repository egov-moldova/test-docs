# Pasul modului de recepționare

În acest pas, solicitantul specifică **modul în care dorește să primească răspunsul** la solicitarea depusă.

## Recepționarea electronică

În majoritatea serviciilor deja dezvoltate, procesarea unei solicitări presupune generarea unui **document electronic**. Pentru a susține digitalizarea serviciilor publice, platforma FOD oferă implicit posibilitatea de:

* **Recepționare electronică prin MCabinet**: documentul generat poate fi consultat și descărcat direct de utilizator din portalul cetățeanului [MCabinet](https://mcabinet.gov.md).

  * Această opțiune este **activată automat** și **nu poate fi deselectată**;
  * În cazul în care serviciul nu generează un document electronic, această opțiune poate fi **ascunsă** de către dezvoltator.

## Recepționarea pe suport de hârtie

În plus, solicitantul poate opta pentru **livrarea fizică** a documentului, alegând una dintre următoarele opțiuni:

* **Livrare la ușă** – utilizând serviciul guvernamental **MDelivery**;
* **Ridicare personală** – de la un oficiu fizic al prestatorului de servicii.

### Considerații tehnice

* Pentru livrarea prin MDelivery, poate fi utilizată **implementarea generică** oferită de FOD;
* Lista punctelor de ridicare trebuie să fie gestionată **individual de către dezvoltator**, conform specificului fiecărui prestator de serviciu.

## Redirecționarea utilizatorului

Dacă solicitantul alege livrarea documentului:

* La trecerea la pasul următor, utilizatorul este **redirecționat către portalul MDelivery** pentru completarea datelor necesare livrării;
* După completarea formularului, utilizatorul este **redirecționat înapoi în Frontoffice** pentru continuarea solicitării.

## Responsabilitatea dezvoltatorului

* Dezvoltatorul trebuie să gestioneze **logica de redirecționare** în funcție de starea cererii:

  * Dacă datele de livrare sunt deja atașate solicitării, utilizatorul poate fi redirecționat **direct către pasul de confirmare**;
  * În caz contrar, utilizatorul trebuie trimis la **pasul de recepționare** pentru completarea informațiilor necesare.

> 🛠️ Este esențial ca integrarea cu MDelivery să fie testată și conformă cu cerințele prestatorului, iar experiența utilizatorului să fie cât mai fluidă.

---

Acest pas sprijină diversificarea modalităților de livrare și contribuie la adaptarea serviciilor digitale la nevoile concrete ale cetățenilor.
