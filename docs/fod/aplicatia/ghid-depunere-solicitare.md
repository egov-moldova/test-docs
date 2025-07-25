
# Ghid pentru Crearea Funcționalului de Depunere a unei Solicitări

Funcționalul de depunere a unei solicitări se bazează în mare parte pe comunicarea dintre aplicația din proiectul **Client** și proiectul **Server**, prin modelele și interfețele prezente în librăria `Fod.Components.Shared`.

## Principii Generale

Majoritatea componentelor FOD:
- Au un model atașat sau pot fi atașate unei proprietăți a unui model.
- Pe lângă atributele proprii, comportamentul acestora poate fi influențat de atributele modelului sau ale proprietăților sale.

Pentru colectarea datelor generice aferente unei solicitări, există deja componente și modele preconfigurate. Pentru datele specifice fiecărui serviciu:
- Se pot crea modele și procese separate.
- Sau se pot moșteni modele existente și extinde funcționalitatea.

## Fluxul de Depunere a unei Solicitări

1. Crearea unui obiect nou după modelul solicitării.
2. Adăugarea sau actualizarea datelor în baza de date.
3. Extragerea datelor din baza de date.
4. Verificarea și confirmarea datelor.
5. Validarea datelor.
6. Semnarea datelor.
7. Generarea / descărcarea / printarea recipisei.

### Procese Intermediare Opționale

- Calcularea costului.
- Calcularea termenului estimativ de perfectare.

## Modelul FodRequestModel

În librăria `Fod.Components.Shared`, există modelul `FodRequestModel`, care poate fi utilizat pentru definirea structurii unei solicitări concrete.

Tot acolo există interfața `IRequestService<T>`, unde `T` este o clasă care moștenește `FodRequestModel`. Această interfață permite crearea ciclului complet de viață al unei solicitări, de la inițiere până la confirmare și/sau achitare.

---

## Exemplu Practic: Crearea unei Solicitări Ghid

### 1. Crearea Modelului de Date

În proiectul `Shared`, în mapa `Models`, adăugăm clasa:

```csharp
public class GhidRequestModel : FodRequestModel
{
}
```

### 2. Implementarea Serviciului IRequestService

În proiectul `Server`, adăugăm în mapa `Services` clasa:

```csharp
public class GhidRequestService : IRequestService<GhidRequestModel>
{
    public async Task<GhidRequestModel> New(string requestTypeCode)
    {
        return new GhidRequestModel();
    }

    // Alte metode pot fi adăugate ulterior
}
```

### 3. Înregistrarea Serviciului și Endpoint-ului

În `Program.cs`:

```csharp
// Înregistrare în containerul de DI
builder.Services.AddRequestService<GhidRequestModel, GhidRequestService>();

// Înregistrare endpoint pentru identificarea solicitării
app.MapRequestType<GhidRequestModel>("ghid");
```

> `ghid` este codul identificator al tipului de solicitare.

---

## Considerații Suplimentare

- De cele mai multe ori, o aplicație gestionează **un singur tip de solicitare și un singur serviciu**.
- Totuși, pot exista scenarii în care:
  - Un tip de solicitare are mai multe servicii.
  - Aplicația gestionează mai multe tipuri de solicitări.
- În acest caz, se înregistrează mai multe implementări de `IRequestService<>`, fiecare având propriul cod identificator.

---

## Concluzie

Procesul de depunere a unei solicitări constă în:

- Definirea modelului.
- Atașarea modelului la componente.
- Colectarea și validarea datelor.
- Persistarea și procesarea ulterioară în backend.

Platforma FOD oferă un cadru flexibil și extensibil pentru gestionarea acestui proces în mod standardizat.
