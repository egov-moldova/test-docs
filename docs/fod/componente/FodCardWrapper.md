# FodCardWrapper

## Documentație pentru componenta FodCardWrapper

### 1. Descriere Generală

`FodCardWrapper` este o componentă wrapper care extinde `FodCard` cu un header pre-stilizat ce include un titlu și o iconiță. Oferă o modalitate rapidă și consistentă de a crea card-uri cu header-e standardizate pentru secțiuni de conținut.

Caracteristici principale:
- Header pre-configurat cu background deschis
- Suport pentru iconiță și titlu în header
- Culoare personalizabilă pentru iconiță
- Spacing automat (margin-bottom)
- Moștenește funcționalitatea FodCard
- Ideal pentru secțiuni de formular sau dashboard

### 2. Utilizare de Bază

#### Card simplu cu titlu și iconiță
```razor
<FodCardWrapper Title="Informații personale" 
                Icon="@FodIcons.Material.Filled.Person">
    <FodTextField Label="Nume" @bind-Value="name" />
    <FodTextField Label="Email" @bind-Value="email" />
</FodCardWrapper>
```

#### Card cu iconiță colorată
```razor
<FodCardWrapper Title="Setări notificări" 
                Icon="@FodIcons.Material.Filled.Notifications"
                IconColor="FodColor.Warning">
    <FodCheckbox Label="Primește notificări email" @bind-Value="emailNotifications" />
    <FodCheckbox Label="Primește notificări SMS" @bind-Value="smsNotifications" />
</FodCardWrapper>
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `Title` | `string` | Titlul afișat în header | - |
| `Icon` | `string` | Iconiță afișată lângă titlu | - |
| `IconColor` | `FodColor` | Culoarea iconiței | `Primary` |
| `ChildContent` | `RenderFragment` | Conținutul card-ului | - |

### 4. Moștenire și Styling

Componenta aplică automat:
- `Class="mb-2"` - margin bottom pentru spacing
- `HeaderClass="bg-light"` - background deschis pentru header
- Font size `h3` și weight `500` pentru titlu

### 5. Exemple Avansate

#### Dashboard cu multiple card-uri
```razor
<FodGrid container spacing="3">
    <FodGrid item xs="12" md="6">
        <FodCardWrapper Title="Statistici vânzări" 
                        Icon="@FodIcons.Material.Filled.TrendingUp"
                        IconColor="FodColor.Success">
            <FodText Typo="Typo.h4">$25,430</FodText>
            <FodText Color="FodColor.TextSecondary">Total luna aceasta</FodText>
            <FodDivider Class="my-2" />
            <FodText Typo="Typo.body2">
                <span class="text-success">+15%</span> față de luna trecută
            </FodText>
        </FodCardWrapper>
    </FodGrid>
    
    <FodGrid item xs="12" md="6">
        <FodCardWrapper Title="Clienți noi" 
                        Icon="@FodIcons.Material.Filled.GroupAdd"
                        IconColor="FodColor.Info">
            <FodText Typo="Typo.h4">142</FodText>
            <FodText Color="FodColor.TextSecondary">Înregistrați această lună</FodText>
            <FodDivider Class="my-2" />
            <FodLoadingLinear Value="71" Max="200" Color="FodColor.Info" />
        </FodCardWrapper>
    </FodGrid>
</FodGrid>
```

#### Formular structurat cu secțiuni
```razor
<EditForm Model="@employeeModel" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodCardWrapper Title="Date personale" 
                    Icon="@FodIcons.Material.Filled.Badge">
        <FodGrid container spacing="2">
            <FodGrid item xs="12" sm="6">
                <FodTextField Label="Nume" 
                              @bind-Value="employeeModel.FirstName" 
                              Required="true" />
            </FodGrid>
            <FodGrid item xs="12" sm="6">
                <FodTextField Label="Prenume" 
                              @bind-Value="employeeModel.LastName" 
                              Required="true" />
            </FodGrid>
            <FodGrid item xs="12" sm="6">
                <FodDatePicker Label="Data nașterii" 
                               @bind-Value="employeeModel.BirthDate" />
            </FodGrid>
            <FodGrid item xs="12" sm="6">
                <FodTextField Label="CNP" 
                              @bind-Value="employeeModel.PersonalId" />
            </FodGrid>
        </FodGrid>
    </FodCardWrapper>
    
    <FodCardWrapper Title="Date contact" 
                    Icon="@FodIcons.Material.Filled.ContactPhone"
                    IconColor="FodColor.Secondary">
        <FodTextField Label="Email" 
                      @bind-Value="employeeModel.Email" 
                      Type="email" />
        <FodTextField Label="Telefon" 
                      @bind-Value="employeeModel.Phone" />
        <FodTextField Label="Adresă" 
                      @bind-Value="employeeModel.Address" 
                      Multiline="true" 
                      Rows="3" />
    </FodCardWrapper>
    
    <FodCardWrapper Title="Informații angajare" 
                    Icon="@FodIcons.Material.Filled.Work"
                    IconColor="FodColor.Primary">
        <FodSelect T="string" Label="Departament" 
                   @bind-Value="employeeModel.Department">
            <FodSelectItem Value="HR">Resurse Umane</FodSelectItem>
            <FodSelectItem Value="IT">IT</FodSelectItem>
            <FodSelectItem Value="Sales">Vânzări</FodSelectItem>
        </FodSelect>
        <FodTextField Label="Funcție" 
                      @bind-Value="employeeModel.Position" />
        <FodDatePicker Label="Data angajării" 
                       @bind-Value="employeeModel.HireDate" />
    </FodCardWrapper>
    
    <div class="text-end mt-3">
        <FodButton Type="submit" Color="FodColor.Primary">
            Salvează
        </FodButton>
    </div>
</EditForm>
```

#### Card cu acțiuni în header (extins)
```razor
@* ExtendedCardWrapper.razor *@
<FodCard Class="mb-2" HeaderClass="bg-light">
    <HeaderTemplate>
        <div class="d-flex justify-content-between align-items-center">
            <FodText Class="m-1 display-2" Style="font-weight: 500;" Typo="Typo.h3">
                <FodIcon Icon="@Icon" Color="@IconColor"/>
                @Title
            </FodText>
            @if (HeaderActions != null)
            {
                <div class="header-actions">
                    @HeaderActions
                </div>
            }
        </div>
    </HeaderTemplate>
    <BodyTemplate>
        @ChildContent
    </BodyTemplate>
</FodCard>

@code {
    [Parameter] public string Title { get; set; }
    [Parameter] public string Icon { get; set; }
    [Parameter] public FodColor IconColor { get; set; } = FodColor.Primary;
    [Parameter] public RenderFragment ChildContent { get; set; }
    [Parameter] public RenderFragment HeaderActions { get; set; }
}

@* Utilizare *@
<ExtendedCardWrapper Title="Listă utilizatori" 
                     Icon="@FodIcons.Material.Filled.People">
    <HeaderActions>
        <FodButton Size="FodSize.Small" 
                   StartIcon="@FodIcons.Material.Filled.Add">
            Adaugă utilizator
        </FodButton>
    </HeaderActions>
    <ChildContent>
        <!-- Listă utilizatori -->
    </ChildContent>
</ExtendedCardWrapper>
```

### 6. Stilizare CSS

```css
/* Override pentru header */
.fod-card .bg-light {
    background-color: #f8f9fa !important;
    border-bottom: 1px solid var(--fod-palette-divider);
}

/* Stilizare titlu în header */
.fod-card-header .display-2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem;
}

/* Iconițe în header */
.fod-card-header .fod-icon-root {
    font-size: 1.75rem;
}

/* Spacing între card-uri */
.fod-card.mb-2 {
    margin-bottom: 1rem !important;
}

/* Responsive */
@media (max-width: 600px) {
    .fod-card-header .display-2 {
        font-size: 1.25rem !important;
    }
    
    .fod-card-header .fod-icon-root {
        font-size: 1.5rem;
    }
}
```

### 7. Scenarii de Utilizare

#### Wizard cu pași în card-uri
```razor
<FodWizard>
    <FodWizardStep Title="Informații generale">
        <FodCardWrapper Title="Detalii proiect" 
                        Icon="@FodIcons.Material.Filled.Description">
            <FodTextField Label="Nume proiect" @bind-Value="project.Name" />
            <FodTextArea Label="Descriere" @bind-Value="project.Description" />
        </FodCardWrapper>
    </FodWizardStep>
    
    <FodWizardStep Title="Echipă">
        <FodCardWrapper Title="Membri echipă" 
                        Icon="@FodIcons.Material.Filled.Groups"
                        IconColor="FodColor.Info">
            <!-- Selector membri echipă -->
        </FodCardWrapper>
    </FodWizardStep>
    
    <FodWizardStep Title="Planificare">
        <FodCardWrapper Title="Timeline proiect" 
                        Icon="@FodIcons.Material.Filled.Schedule"
                        IconColor="FodColor.Warning">
            <FodDateRangePicker Label="Perioadă proiect" 
                                @bind-StartDate="project.StartDate"
                                @bind-EndDate="project.EndDate" />
        </FodCardWrapper>
    </FodWizardStep>
</FodWizard>
```

#### Card-uri colapsabile
```razor
@foreach (var section in formSections)
{
    <FodCardWrapper Title="@section.Title" 
                    Icon="@section.Icon"
                    IconColor="@section.IconColor">
        @if (section.IsExpanded)
        {
            <div class="card-content">
                @section.Content
            </div>
        }
        <div class="text-end">
            <FodButton Variant="FodVariant.Text" 
                       Size="FodSize.Small"
                       OnClick="() => ToggleSection(section)">
                @(section.IsExpanded ? "Restrânge" : "Extinde")
            </FodButton>
        </div>
    </FodCardWrapper>
}

@code {
    private List<FormSection> formSections = new();
    
    private void ToggleSection(FormSection section)
    {
        section.IsExpanded = !section.IsExpanded;
    }
    
    public class FormSection
    {
        public string Title { get; set; }
        public string Icon { get; set; }
        public FodColor IconColor { get; set; }
        public RenderFragment Content { get; set; }
        public bool IsExpanded { get; set; } = true;
    }
}
```

### 8. Best Practices

1. **Iconițe descriptive** - Folosiți iconițe care reprezintă conținutul
2. **Culori consistente** - Mențineți o paletă de culori coerentă
3. **Titluri clare** - Titluri scurte și descriptive
4. **Grupare logică** - Grupați conținutul related într-un card
5. **Spacing consistent** - Folosiți marginile implicite

### 9. Performanță

- Componentă lightweight, doar wrapper peste FodCard
- Nu adaugă logică complexă
- Randare eficientă

### 10. Accesibilitate

- Structură semantică cu header și body
- Iconițele sunt decorative (nu necesită alt text)
- Titlul oferă context pentru conținut
- Contrast adecvat pentru header

### 11. Comparație cu FodCard

| Caracteristică | FodCard | FodCardWrapper |
|----------------|---------|----------------|
| Header custom | Da | Pre-stilizat |
| Flexibilitate | Maximă | Limitată |
| Ușurință utilizare | Necesită mai mult cod | Rapid de implementat |
| Use case | Card-uri complexe | Card-uri standard |

### 12. Migrare de la FodCard

```razor
@* Înainte - FodCard *@
<FodCard Class="mb-2" HeaderClass="bg-light">
    <HeaderTemplate>
        <FodText Class="m-1 display-2" Style="font-weight: 500;" Typo="Typo.h3">
            <FodIcon Icon="@FodIcons.Material.Filled.Settings" Color="FodColor.Primary"/>
            Setări
        </FodText>
    </HeaderTemplate>
    <BodyTemplate>
        <!-- conținut -->
    </BodyTemplate>
</FodCard>

@* După - FodCardWrapper *@
<FodCardWrapper Title="Setări" 
                Icon="@FodIcons.Material.Filled.Settings">
    <!-- conținut -->
</FodCardWrapper>
```

### 13. Troubleshooting

#### Iconița nu apare
- Verificați că valoarea Icon este validă
- Verificați importul FodIcons

#### Stilizare inconsistentă
- Verificați că nu există CSS care suprascrie stilurile
- Folosiți !important dacă e necesar

### 14. Concluzie

`FodCardWrapper` simplifică crearea de card-uri cu header-e standardizate, reducând codul boilerplate și asigurând consistență vizuală. Perfect pentru formulare structurate, dashboard-uri și orice aplicație care necesită gruparea vizuală a conținutului cu titluri și iconițe descriptive.