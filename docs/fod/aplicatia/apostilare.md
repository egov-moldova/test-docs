# Apostilarea documentelor generate

În cazul în care, în urma prestării unui serviciu, este generat un document ce poate fi **apostilat**, platforma FOD oferă posibilitatea solicitantului de a iniția o **solicitare de apostilare**, direct din cadrul procesului de depunere a cererii.

## Descrierea pasului

Acest pas are loc după completarea datelor necesare pentru prestarea serviciului și imediat **înainte de confirmarea finală** a solicitării.

### Ce se întâmplă în acest pas:

* Solicitantului i se afișează **lista documentelor** ce urmează a fi eliberate în urma prestării serviciului;
* Utilizatorul este întrebat dacă **dorește apostilarea** unuia sau mai multor documente;
* În cazul unui răspuns afirmativ, utilizatorul va trebui să:

  * **Selecteze țara** pentru care este necesară apostilarea;
  * **Aleagă termenul de execuție** (standard sau urgent, dacă este cazul);
  * **Confirme achitarea** taxei aferente apostilării.

> 💡 Integrarea acestui pas este opțională și se aplică doar în cazul serviciilor care generează documente eligibile pentru apostilare conform legislației în vigoare.

## Responsabilitatea dezvoltatorului

* Acest pas facilitează **doar colectarea preferințelor utilizatorului** privind apostilarea.
* Depunerea efectivă a solicitării de apostilare către sistemul relevant **revine dezvoltatorului**, care trebuie să utilizeze **serviciile disponibile în cadrul FOD**.
* La inițializarea unei cereri noi, dezvoltatorul trebuie să se asigure că sunt **încărcate opțiunile disponibile de apostilare**, astfel încât utilizatorul să le poată selecta.
* În momentul **generării documentului de răspuns** sau al **încărcării acestuia**, dezvoltatorul trebuie să expedieze documentul către sistemul de apostilare folosind metodele puse la dispoziție prin **interfața `IApostilaClient`**.

## Beneficii

* Simplifică procesul pentru cetățean, evitând o solicitare separată pentru apostilare;
* Asigură un flux complet digital, de la solicitare până la obținerea documentului final apostilat.

---

Această funcționalitate îmbunătățește experiența utilizatorului și contribuie la reducerea birocrației în procesul de legalizare a documentelor emise electronic.
