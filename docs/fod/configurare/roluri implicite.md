## Roluri și contexte implicite

Aplicația **FOD** utilizează un mecanism numit **contextul utilizatorului**. În momentul autentificării, aplicația creează automat o listă de contexte asociate utilizatorului.

Implicit, se generează următoarele trei tipuri de contexte:

- **Contextul Persoanei Fizice**  
  Atunci când utilizatorul acționează în nume propriu.

- **Contextul Persoanei Juridice**  
  Atunci când utilizatorul acționează în numele unei persoane juridice.

- **Contextul Operatorului CUPS**  
  Atunci când utilizatorul, în calitate de operator **CUPS**, acționează în numele unei persoane fizice terțe.
