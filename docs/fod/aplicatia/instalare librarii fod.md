# Instalarea librăriilor FOD

În structura unui proiect Blazor WebAssembly, au fost create mai multe librării FOD care trebuie utilizate în proiectele corespunzătoare:

- **Fod.Components**  
  Conține toate componentele UI, stiluri și serviciile utilizate de către componente pentru dezvoltarea unui serviciu. Aceasta trebuie adăugată în proiectul `Client`.

- **Fod.Components.Shared**  
  Conține modele și servicii comune care sunt utilizate atât de aplicația `Client`, cât și de aplicația `Server`. Aceasta trebuie adăugată în proiectul `Shared`.

- **Fod.Components.Server**  
  Conține logica componentelor care trebuie rulată pe partea de server. Aceasta trebuie adăugată în proiectul `Server`.

## Acces la librării

Pentru a adăuga aceste librării, este necesar accesul la **repository-ul de librării al Agenției de Guvernare Electronică**:

🔗 [FOD Feed Repository](https://dev.azure.com/egalab/FOD/_artifacts/feed/Framework@7605b1ca-c804-48bc-9f9d-a10386457502)

## Referințe de adăugat

Adaugă următoarele referințe în fișierele `.csproj` corespunzătoare:

- `Fod.Components` în `Client.csproj`
- `Fod.Components.Shared` în `Shared.csproj`
- `Fod.Components.Server` în `Server.csproj`
