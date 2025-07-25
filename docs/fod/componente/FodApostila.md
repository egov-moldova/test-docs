# FodApostila

## Descriere Generală

Componenta `FodApostila` permite utilizatorilor să solicite apostilarea documentelor emise de autoritățile publice din Republica Moldova. Apostila este o certificare specială care validează autenticitatea documentelor publice pentru utilizare internațională, conform Convenției de la Haga din 1961.

Componenta oferă o interfață completă pentru:
- Selectarea țării de destinație
- Alegerea termenului de execuție
- Calcularea automată a datei estimate de finalizare
- Integrare cu servicii de solicitare documente

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodApostila Model="@apostilaModel" 
             Options="@apostilaOptions"
             ServiceRequests="@serviceRequests" />

@code {
    private FodApostilaModel apostilaModel = new();
    private FodApostilaOptionsModel apostilaOptions;
    private List<FodServiceRequestModel> serviceRequests = new();

    protected override async Task OnInitializedAsync()
    {
        // Încărcarea opțiunilor disponibile
        apostilaOptions = await LoadApostilaOptions();
    }
}
```

### Integrare cu wizard

```razor
<FodWizard>
    <FodWizardStep Title="Apostilare">
        <FodApostila Model="@apostilaModel" 
                     Options="@apostilaOptions"
                     ServiceRequests="@serviceRequests"
                     RequestorType="PersonType.Physical"
                     MainServiceRequestsEstimatedResolveDate="@mainRequestDate"
                     OnExecutionTermChanged="@HandleExecutionTermChange" />
    </FodWizardStep>
</FodWizard>

@code {
    private DateTime? mainRequestDate = DateTime.Now.AddDays(5);

    private void HandleExecutionTermChange()
    {
        // Actualizare costuri sau alte acțiuni
        Console.WriteLine("Termen de execuție modificat");
    }
}
```

### Exemplu cu cascading values

```razor
<CascadingValue Value="@apostilaOptions">
    <CascadingValue Value="PersonType.Legal">
        <FodApostila Model="@apostilaModel" 
                     ServiceRequests="@serviceRequests" />
    </CascadingValue>
</CascadingValue>
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Model | FodApostilaModel | - | Modelul de date pentru solicitarea de apostilare (obligatoriu) |
| Options | FodApostilaOptionsModel | - | Opțiunile disponibile (țări, termene) - poate fi și CascadingParameter |
| ServiceRequests | IEnumerable<FodServiceRequestModel> | - | Lista documentelor care pot fi apostilate |
| RequestorType | PersonType | - | Tipul solicitantului (Fizic/Juridic) - poate fi și CascadingParameter |
| WizardStep | FodWizardStep | - | Referință la pasul de wizard pentru validare (CascadingParameter) |
| MainServiceRequestsEstimatedResolveDate | DateTime? | DateTime.Now | Data estimată pentru finalizarea serviciilor principale |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| OnExecutionTermChanged | EventCallback | Declanșat când se modifică termenul de execuție |

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodApostilaDisplay** - Pentru afișarea detaliilor unei solicitări de apostilare existente
- **FodCheckBox2** - Pentru selectarea opțiunii de apostilare
- **FODInputSelect** - Pentru selectarea țării și termenului
- **FodAlert** - Pentru afișarea mesajelor de eroare/avertizare
- **FodList/FodListItem** - Pentru afișarea listei de documente

## Stilizare

Componenta folosește stilurile Bootstrap standard pentru layout (row, col-md-12) și stilurile componentelor FOD încapsulate.

### Personalizare

```css
/* Ajustarea spațierii pentru checkbox */
.fod-apostila .fod-checkbox {
    margin-left: 5px;
}

/* Stilizare pentru lista de documente */
.fod-apostila .fod-list {
    margin-top: 1rem;
}
```

## Note și observații

1. **Serviciu obligatoriu** - Necesită injectarea `IApostilaComponentService` pentru calculul datelor
2. **Validare automată** - Se integrează cu EditContext pentru validare în wizard
3. **Calcul asincron** - Calculul datei estimate se face asincron cu indicator de încărcare
4. **Disponibilitate condiționată** - Afișează mesaj de eroare dacă apostilarea nu este disponibilă
5. **Actualizare dinamică** - Termenele de execuție se filtrează după tipul solicitantului

## Bune practici

1. **Încărcare opțiuni** - Încărcați `FodApostilaOptionsModel` înainte de randarea componentei
2. **Gestionare erori** - Tratați cazurile când Options sau Model sunt null
3. **Tip solicitant** - Specificați `RequestorType` pentru filtrare corectă a termenelor
4. **Date estimate** - Furnizați `MainServiceRequestsEstimatedResolveDate` pentru calcul precis
5. **Validare** - Integrați cu FodWizardStep pentru validare automată în flow-uri complexe

## Concluzie

Componenta FodApostila oferă o soluție completă pentru gestionarea solicitărilor de apostilare în aplicațiile guvernamentale. Cu suport pentru calcul automat al termenelor, integrare cu wizard-uri și validare automată, facilitează procesul de apostilare pentru utilizatori.