# Creare proiect FrontOffice

## Crearea proiectului pentru FrontOffice

În mapa creată pentru soluție, vom crea un folder numit `src`, unde vom depozita codul sursă al proiectului. În interiorul acestuia, vom crea folderul `Frontoffice` și vom rula următoarea comandă:

```bash
dotnet new blazorwasm -ho
```

Aceasta va crea o soluție nouă formată din trei proiecte separate:

- **Client**
- **Shared**
- **Server**

Deoarece am folosit flagul `-ho`, comanda va genera o soluție **hosted**, ceea ce înseamnă că aplicația Front-End va fi servită de către proiectul `Server`. Acesta trebuie să fie proiectul pornit pentru a rula aplicația.

## Pornirea aplicației

Pentru a porni aplicația, accesează folderul `Server` folosind terminalul și rulează comanda:

```bash
dotnet run
```

Aplicația va rula pe un port aleatoriu stabilit automat la momentul generării proiectului. Navigând în browser la acel port, se va deschide interfața aplicației FrontOffice.