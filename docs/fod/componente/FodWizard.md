# FodWizard
**Documentație pentru componentele `FodWizard` și `FodWizardStep`**

---

## Descriere generală
`FodWizard` este o componentă Blazor de tip "wizard" care permite parcurgerea unui proces multi-pas în cadrul aplicației. Fiecare pas este reprezentat de o componentă `FodWizardStep`. Acest model modular permite validări, navigare condiționată și personalizare completă a pașilor.

---

## FodWizard

### Utilizare
Componenta `FodWizard` trebuie folosită ca container pentru unul sau mai multe elemente `FodWizardStep`. Ea controlează fluxul de navigare între pași și expune funcționalități de validare, progres și control asupra fluxului utilizatorului.

### Proprietăți

| Proprietate         | Tip                        | Descriere                                                           |
|---------------------|-----------------------------|----------------------------------------------------------------------|
| ShowProgress        | `bool`                      | Afișează progresul parcurgerii pașilor.                             |
| Enabled             | `bool`                      | Activează sau dezactivează componenta.                              |
| ChildContent        | `RenderFragment`            | Pașii (`FodWizardStep`) incluși în wizard.                          |
| ActiveStep          | `FodWizardStep`             | Pasul activ curent.                                                 |
| InitialStep         | `int`                       | Indexul pasului cu care să se înceapă.                              |
| ActiveStepIx        | `int`                       | Indexul pasului activ curent.                                       |
| Title               | `string`                    | Titlul afișat pentru wizard.                                        |
| DisableScrollOnTop  | `bool`                      | Dacă este true, dezactivează scroll-ul automat în top la schimbare. |
| Typo                | `Typo`                      | Stil tipografic pentru titlu.                                       |

### Funcționalități cheie
- Navigare între pași cu `GoNext()`, `GoBack()`, `GoToStep(int)`.
- Activare pas cu `SetActive(FodWizardStep)`.
- Control validare pas curent și navigare condiționată (`NextStep`, `BackStep`).
- Obținere progres curent (`GetProgressValue()`).

---

## FodWizardStep

### Descriere
`FodWizardStep` reprezintă un pas individual din cadrul `FodWizard`. Conține conținutul vizual și logica asociată pentru validare și navigare.

### Proprietăți

| Proprietate           | Tip                         | Descriere                                                                 |
|------------------------|------------------------------|----------------------------------------------------------------------------|
| Step                  | `int`                       | Identificator numeric al pasului.                                         |
| Name                  | `string`                    | Numele afișat al pasului.                                                 |
| ChildContent          | `RenderFragment`            | Conținutul HTML al pasului.                                               |
| ValidateEditContextsOnNext | `bool`                | Dacă este true, validează toate EditContext-urile înregistrate.           |
| OnNext                | `Func<Task<bool>>`          | Funcție apelată la click pe Next. Returnează `true` pentru a continua.    |
| NextStep              | `Func<int>`                 | Pasul următor către care se face navigarea.                               |
| OnBack                | `Func<Task<bool>>`          | Funcție apelată la click pe Back. Returnează `true` pentru a reveni.      |
| BackStep              | `Func<int>`                 | Pasul anterior personalizat.                                              |
| OnActivate            | `Func<Task>`                | Se execută când pasul devine activ.                                       |
| Icon                  | `string`                    | Icon asociat pasului.                                                     |
| EditContext           | `EditContext`               | Context de validare Blazor.                                               |
| Optional              | `bool`                      | Marchează pasul ca fiind opțional.                                        |
| ShowTitle             | `bool`                      | Afișează titlul pasului în UI.                                            |
| NextButtonText        | `string`                    | Text personalizat pentru butonul „Next”.                                  |
| BackButtonText        | `string`                    | Text personalizat pentru butonul „Back”.                                  |
| CanGoNext             | `bool`                      | Permite navigarea către pasul următor.                                   |
| CanGoBack             | `bool`                      | Permite revenirea la pasul anterior.                                     |

### Metode utile
- `RegisterEditContext(EditContext)`: înregistrează un context pentru validare.
- `Validate()`: validează toate EditContext-urile asociate.

---

## Exemplu de utilizare

```razor
<FodWizard ShowProgress="true" Title="Asistent de înregistrare">
    <FodWizardStep Step="1" Name="Introducere">
        <p>Pasul 1 - introducere date utilizator.</p>
    </FodWizardStep>

    <FodWizardStep Step="2" Name="Confirmare" NextButtonText="Continuă">
        <p>Pasul 2 - confirmare date introduse.</p>
    </FodWizardStep>
</FodWizard>
```

---

## Observații
- Fiecare pas poate conține validări proprii prin `EditContext` și logica suplimentară asincronă (`OnNext`, `OnBack`).
- Componenta oferă o experiență fluidă și modulară pentru formulare complexe sau pași succesivi în aplicație.
