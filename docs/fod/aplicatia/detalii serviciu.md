# Pasul Detaliilor Serviciului

Pasul dedicat **detaliilor serviciului** constă în colectarea informațiilor esențiale pentru prestarea efectivă a serviciului solicitat.

## Descriere generală

În mod implicit, platforma permite ca un solicitant să poată solicita **mai multe servicii într-o singură cerere**. Cu toate acestea, în majoritatea serviciilor deja implementate, **se restricționează depunerea la un singur serviciu per solicitare**.

Această decizie aparține **dezvoltatorilor**, care trebuie să decidă:

* Cum oferă posibilitatea de selecție a serviciului solicitat;
* Cum structurează și afișează interfața pentru completarea datelor aferente fiecărui serviciu.

## Elemente obligatorii

În această etapă, solicitantul trebuie să completeze următoarele informații:

* **Selectarea serviciului dorit** – doar dacă există mai multe servicii posibile;
* **Selectarea termenului de prestare a serviciului** – dacă serviciul permite termene alternative (ex: termen standard vs. termen urgent);

## Date specifice suplimentare

În funcție de serviciul ales, este posibil ca prestatorul să solicite **informații adiționale** relevante pentru procesul de analiză. Aceste câmpuri suplimentare:

* Vor fi implementate **la discreția dezvoltatorului**;
* Trebuie să fie definite clar de către prestatorul de servicii;
* Pot include atât câmpuri obligatorii cât și opționale, în funcție de fluxul stabilit.

> ⚠️ Este responsabilitatea dezvoltatorului să respecte cerințele prestatorului și să adapteze formularul în mod corespunzător.

---

Această etapă este critică pentru a defini obiectul solicitării și a oferi prestatorului toate datele necesare pentru a iniția procesul de analiză.
