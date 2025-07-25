# FodServiceRequestsStatistics

## Documentație pentru componenta FodServiceRequestsStatistics

### 1. Descriere Generală

`FodServiceRequestsStatistics` este o componentă business specializată pentru afișarea statisticilor detaliate despre cererile de servicii. Oferă filtrare pe perioadă de timp și afișează multiple metrici privind starea cererilor.

Caracteristici principale:
- Filtrare pe interval de date (de la - până la)
- Afișare statistici pentru toate stările cererilor
- Statistici separate pentru MDelivery
- Statistici pentru cereri confirmate din frontoffice/backoffice
- Statistici pentru cereri de apostilare
- Opțiune pentru afișarea cererilor suspendate
- Actualizare dinamică la aplicarea filtrului

### 2. Utilizare de Bază

#### Afișare simplă de statistici
```razor
<FodServiceRequestsStatistics />
```

#### Cu afișare cereri suspendate
```razor
<FodServiceRequestsStatistics ShowSuspendeServiceRequestsStats="true" />
```

### 3. Atribute și Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `ShowSuspendeServiceRequestsStats` | `bool` | Afișează statistici pentru cereri suspendate | `false` |

### 4. Exemple de Utilizare

#### Dashboard administrativ
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h5" GutterBottom="true">
            Statistici cereri de servicii
        </FodText>
        
        <FodServiceRequestsStatistics ShowSuspendeServiceRequestsStats="true" />
    </FodCardContent>
</FodCard>
```

#### Pagină de raportare
```razor
@page "/admin/rapoarte/statistici"

<FodContainer>
    <FodGrid Container="true" Spacing="3">
        <FodGrid Item="true" xs="12">
            <FodText Typo="Typo.h4" GutterBottom="true">
                Raport statistici cereri
            </FodText>
        </FodGrid>
        
        <FodGrid Item="true" xs="12">
            <FodPaper Elevation="2" Class="pa-4">
                <FodServiceRequestsStatistics />
            </FodPaper>
        </FodGrid>
        
        <FodGrid Item="true" xs="12">
            <FodButton StartIcon="@FodIcons.Material.Filled.Print" 
                       OnClick="PrintStatistics">
                Printează raport
            </FodButton>
            <FodButton StartIcon="@FodIcons.Material.Filled.GetApp" 
                       OnClick="ExportStatistics"
                       Class="ml-2">
                Exportă CSV
            </FodButton>
        </FodGrid>
    </FodGrid>
</FodContainer>

@code {
    private async Task PrintStatistics()
    {
        await PrintingService.PrintAsync();
    }
    
    private async Task ExportStatistics()
    {
        // Logică export CSV
    }
}
```

#### În tab-uri cu alte rapoarte
```razor
<FodTabControl>
    <FodTabPage Title="Statistici generale">
        <FodServiceRequestsStatistics />
    </FodTabPage>
    
    <FodTabPage Title="Statistici pe servicii">
        <!-- Alte statistici -->
    </FodTabPage>
    
    <FodTabPage Title="Statistici financiare">
        <!-- Statistici plăți -->
    </FodTabPage>
</FodTabControl>
```

#### Cu perioada presetată
```razor
<FodCard>
    <FodCardHeader>
        <FodText Typo="Typo.h6">
            Statistici luna curentă
        </FodText>
    </FodCardHeader>
    <FodCardContent>
        <FodServiceRequestsStatistics />
    </FodCardContent>
</FodCard>

@code {
    // Componenta poate fi extinsă pentru a preseta perioada
    protected override void OnInitialized()
    {
        // Setare filtru implicit pentru luna curentă
    }
}
```

### 5. Metrici afișate

Componenta afișează următoarele statistici:

#### Statistici generale
- **Total cereri de servicii** - Numărul total de cereri
- **Cereri în ciornă** - Cereri începute dar nefinalizate
- **Cereri noi** - Cereri depuse recent
- **Cereri plătite** - Cereri cu plata efectuată
- **Cereri gratuite** - Cereri scutite de taxă
- **Cereri în procesare** - Cereri în curs de procesare
- **Cereri procesate** - Cereri finalizate de operator
- **Cereri emise** - Cereri cu documente emise
- **Cereri respinse** - Cereri refuzate
- **Cereri suspendate** - Cereri temporar oprite (opțional)

#### Statistici confirmare
- **Cereri confirmate** - Total cereri confirmate
- **Cereri cu răspuns pe hârtie** - Livrare fizică
- **Cereri cu răspuns electronic** - Livrare digitală

#### Statistici MDelivery
- **Cereri MDelivery noi** - Cereri pentru livrare prin MDelivery
- **Cereri MDelivery confirmate** - Confirmate pentru livrare
- **Cereri MDelivery procesate** - În curs de livrare
- **Cereri MDelivery emise** - Livrate prin MDelivery

#### Statistici canale
- **Cereri confirmate frontoffice** - Depuse direct la ghișeu
- **Cereri confirmate backoffice** - Procesate intern

#### Statistici speciale
- **Cereri de apostilare confirmate** - Cereri pentru apostilă

### 6. Servicii necesare

Componenta necesită următoarele servicii înregistrate:

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IServiceRequestStatisticsService, ServiceRequestStatisticsService>();
```

### 7. Modele de date

#### ServiceRequestStatisticsFilter
```csharp
public class ServiceRequestStatisticsFilter
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
```

#### ServiceRequestStatisticsModel
```csharp
public class ServiceRequestStatisticsModel
{
    public int TotalServiceRequests { get; set; }
    public int DraftServiceRequests { get; set; }
    public int NewServiceRequests { get; set; }
    public int PaidServiceRequests { get; set; }
    public int FreeServiceRequests { get; set; }
    public int InProgressServiceRequests { get; set; }
    public int ProcessedServiceRequests { get; set; }
    public int IssuedServiceRequests { get; set; }
    public int RejectedServiceRequests { get; set; }
    public int SuspendedServiceRequests { get; set; }
    public int ConfirmedServiceRequests { get; set; }
    public int ConfirmedServiceRequestsWithResponseOnPaper { get; set; }
    public int ConfirmedServiceRequestsWithResponseOnElectronicDocument { get; set; }
    public int NewMDeliveryServiceRequets { get; set; }
    public int ConfirmedMDeliveryServiceRequests { get; set; }
    public int ProcessedMdeliveryServiceRequests { get; set; }
    public int IssuedMDeliveryServiceRequests { get; set; }
    public int FrontofficeConfirmedServiceRequests { get; set; }
    public int BackofficeConfirmedServiceRequests { get; set; }
    public int ConfirmedApostillationRequests { get; set; }
}
```

### 8. Stilizare

```css
/* Stil pentru lista de statistici */
.statistics-list {
    list-style: none;
    padding: 0;
}

.statistics-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--fod-palette-divider);
}

.statistics-list li:last-child {
    border-bottom: none;
}

/* Evidențiere valori importante */
.statistics-value {
    font-weight: bold;
    color: var(--fod-palette-primary-main);
}

/* Layout responsive */
@media (min-width: 768px) {
    .statistics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}
```

### 9. Localizare

Componenta folosește următoarele chei de localizare din resursa `General`:

- `From_Date_Label` - Etichetă pentru data de început
- `To_Date_Label` - Etichetă pentru data de sfârșit
- `Apply_Filter_Label` - Text buton aplicare filtru
- `Total_Service_Requests_Label` - Total cereri
- `Draft_Service_Requests_Label` - Cereri ciornă
- Și toate celelalte etichete pentru fiecare tip de statistică

### 10. Best Practices

1. **Perioade rezonabile** - Nu permiteți intervale prea mari care pot încărca serverul
2. **Cache** - Considerați cache pentru perioade frecvent accesate
3. **Loading state** - Adăugați indicator de încărcare pentru perioade mari
4. **Validare date** - Validați că data de început <= data de sfârșit
5. **Permisiuni** - Restricționați accesul doar pentru utilizatori autorizați
6. **Export** - Oferiți opțiuni de export pentru raportare

### 11. Integrare cu alte componente

#### Cu grafice
```razor
<FodGrid Container="true" Spacing="3">
    <FodGrid Item="true" xs="12" md="6">
        <FodServiceRequestsStatistics />
    </FodGrid>
    
    <FodGrid Item="true" xs="12" md="6">
        <FodCard>
            <FodCardContent>
                <FodText Typo="Typo.h6">Distribuție pe stări</FodText>
                <!-- Grafic pie/bar cu distribuția -->
            </FodCardContent>
        </FodCard>
    </FodGrid>
</FodGrid>
```

#### În modal pentru detalii
```razor
<FodModal @bind-IsVisible="showStatistics" Title="Statistici detaliate">
    <BodyContent>
        <FodServiceRequestsStatistics ShowSuspendeServiceRequestsStats="true" />
    </BodyContent>
    <FooterContent>
        <FodButton OnClick="CloseModal">Închide</FodButton>
    </FooterContent>
</FodModal>
```

### 12. Performanță

- Folosiți paginare pentru seturi mari de date
- Implementați loading skeleton pentru experiență mai bună
- Cache rezultate pentru perioade frecvente
- Considerați agregare pe server pentru performanță

### 13. Troubleshooting

#### Statisticile nu se actualizează
- Verificați că serviciul este înregistrat corect
- Verificați conexiunea la bază de date
- Verificați permisiunile utilizatorului

#### Filtrele nu funcționează
- Verificați formatarea datelor
- Verificați că datele sunt în intervalul valid
- Verificați timezone-ul aplicației

### 14. Concluzie

`FodServiceRequestsStatistics` oferă o vizualizare completă a statisticilor pentru cererile de servicii guvernamentale. Cu filtrare flexibilă și afișare detaliată a tuturor stărilor posibile, componenta este esențială pentru monitorizarea și raportarea activității în sistemul FOD.