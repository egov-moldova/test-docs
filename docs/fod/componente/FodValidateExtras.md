# FodValidateExtras

## Documentație pentru componenta FodValidateExtras

### 1. Descriere Generală

`FodValidateExtras` este o componentă specializată pentru validarea numerelor de extras din documente oficiale. Oferă o interfață simplă pentru introducerea și verificarea validității unui număr de extras prin integrarea cu serviciul `IValidateExtrasService`.

Caracteristici principale:
- Validare număr extras în timp real
- Interfață simplă cu input și buton
- Afișare status validare
- Integrare cu serviciul de validare extras
- Feedback vizual pentru rezultat
- Componentă autonomă

### 2. Utilizare de Bază

#### Validare simplă extras
```razor
<FodValidateExtras />
```

#### Integrare în formular
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Verificare document</FodText>
        <FodValidateExtras />
    </FodCardContent>
</FodCard>
```

### 3. Model ValidateExtrasModel

```csharp
public class ValidateExtrasModel
{
    public string ExtrasNumber { get; set; }
    public string Status { get; set; }
    public bool IsValid { get; set; }
    public DateTime? ValidationDate { get; set; }
    public string DocumentType { get; set; }
    // alte proprietăți relevante
}
```

### 4. Exemple Avansate

#### Componentă extinsă cu funcționalități adiționale
```razor
@inherits FodValidateExtras

<div class="validate-extras-extended">
    @if (validateExtrasModel == null)
    {
        <FodTextField Label="Numărul extrasului"
                      @bind-Value="ExtrasNumber"
                      Placeholder="Ex: 123456789"
                      HelperText="Introduceți numărul complet al extrasului"
                      Required="true"
                      Pattern="[0-9]{9}"
                      OnKeyUp="@(async (e) => { if (e.Key == "Enter") await ValidateExtras(); })" />
        
        <div class="d-flex justify-content-between align-items-center mt-3">
            <FodButton Color="FodColor.Secondary" 
                       Variant="FodVariant.Text"
                       OnClick="Clear">
                Șterge
            </FodButton>
            
            <FodButton Color="FodColor.Success" 
                       Variant="FodVariant.Filled"
                       OnClick="ValidateExtras"
                       Disabled="@(string.IsNullOrWhiteSpace(ExtrasNumber) || isValidating)">
                @if (isValidating)
                {
                    <FodLoadingCircular Size="FodSize.Small" />
                    <span class="ms-2">Verificare...</span>
                }
                else
                {
                    <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" />
                    <span class="ms-2">Verifică</span>
                }
            </FodButton>
        </div>
    }
    else
    {
        <FodAlert Severity="@(validateExtrasModel.IsValid ? FodSeverity.Success : FodSeverity.Error)"
                  ShowCloseIcon="true"
                  OnClose="Reset">
            <div class="validation-result">
                <strong>Status:</strong> @validateExtrasModel.Status
                @if (validateExtrasModel.ValidationDate.HasValue)
                {
                    <br />
                    <small>Validat la: @validateExtrasModel.ValidationDate.Value.ToString("dd.MM.yyyy HH:mm")</small>
                }
            </div>
        </FodAlert>
        
        <FodButton Class="mt-3" 
                   Color="FodColor.Primary"
                   Variant="FodVariant.Text"
                   OnClick="Reset">
            Verifică alt extras
        </FodButton>
    }
</div>

@code {
    private bool isValidating;
    
    private void Clear()
    {
        ExtrasNumber = string.Empty;
        validateExtrasModel = null;
    }
    
    private void Reset()
    {
        Clear();
        StateHasChanged();
    }
    
    protected override async Task ValidateExtras()
    {
        if (string.IsNullOrWhiteSpace(ExtrasNumber))
            return;
            
        isValidating = true;
        try
        {
            await base.ValidateExtras();
        }
        finally
        {
            isValidating = false;
        }
    }
}
```

#### Integrare cu istoric validări
```razor
<div class="extras-validation-container">
    <FodGrid container spacing="3">
        <FodGrid item xs="12" md="6">
            <FodCard>
                <FodCardContent>
                    <FodText Typo="Typo.h6">Validare extras nou</FodText>
                    <FodValidateExtras @ref="validator" />
                </FodCardContent>
            </FodCard>
        </FodGrid>
        
        <FodGrid item xs="12" md="6">
            <FodCard>
                <FodCardContent>
                    <FodText Typo="Typo.h6">Istoric validări</FodText>
                    <FodList Dense="true">
                        @foreach (var validation in validationHistory)
                        {
                            <FodListItem>
                                <FodListItemText>
                                    <div class="d-flex justify-content-between">
                                        <span>@validation.ExtrasNumber</span>
                                        <FodChip Color="@(validation.IsValid ? FodColor.Success : FodColor.Error)"
                                                 Size="FodSize.Small">
                                            @(validation.IsValid ? "Valid" : "Invalid")
                                        </FodChip>
                                    </div>
                                    <small class="text-muted">
                                        @validation.ValidationDate.ToString("dd.MM.yyyy HH:mm")
                                    </small>
                                </FodListItemText>
                            </FodListItem>
                        }
                    </FodList>
                </FodCardContent>
            </FodCard>
        </FodGrid>
    </FodGrid>
</div>

@code {
    private FodValidateExtras validator;
    private List<ValidateExtrasModel> validationHistory = new();
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            // Încarcă istoric din local storage sau API
            validationHistory = await LoadValidationHistory();
            StateHasChanged();
        }
    }
}
```

#### Validare în bulk
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Validare multiplă extrase</FodText>
        
        <FodTextArea @bind-Value="bulkNumbers"
                     Label="Numere extrase (unul pe linie)"
                     Rows="5"
                     HelperText="Introduceți mai multe numere de extras, câte unul pe linie" />
        
        <FodButton Class="mt-3"
                   Color="FodColor.Primary"
                   OnClick="ValidateBulk"
                   Disabled="@(string.IsNullOrWhiteSpace(bulkNumbers) || isProcessing)">
            Validează toate
        </FodButton>
        
        @if (bulkResults.Any())
        {
            <FodDivider Class="my-3" />
            
            <FodDataTable Items="@bulkResults" Dense="true">
                <FodColumn Title="Număr extras" Field="@(r => r.ExtrasNumber)" />
                <FodColumn Title="Status" Field="@(r => r.Status)" />
                <FodColumn Title="Valid">
                    <Template>
                        <FodIcon Icon="@(context.IsValid ? FodIcons.Material.Filled.Check : FodIcons.Material.Filled.Close)"
                                 Color="@(context.IsValid ? FodColor.Success : FodColor.Error)" />
                    </Template>
                </FodColumn>
            </FodDataTable>
            
            <div class="mt-3 text-end">
                <FodButton Color="FodColor.Secondary"
                           StartIcon="@FodIcons.Material.Filled.GetApp"
                           OnClick="ExportResults">
                    Exportă rezultate
                </FodButton>
            </div>
        }
    </FodCardContent>
</FodCard>

@code {
    [Inject] private IValidateExtrasService ValidateService { get; set; }
    
    private string bulkNumbers;
    private List<ValidateExtrasModel> bulkResults = new();
    private bool isProcessing;
    
    private async Task ValidateBulk()
    {
        isProcessing = true;
        bulkResults.Clear();
        
        var numbers = bulkNumbers.Split('\n', StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var number in numbers)
        {
            var result = await ValidateService.ValidateExtras(number.Trim());
            bulkResults.Add(result);
            StateHasChanged(); // Update progresiv
        }
        
        isProcessing = false;
    }
    
    private async Task ExportResults()
    {
        // Export CSV sau Excel
        var csv = "Număr Extras,Status,Valid\n" +
            string.Join("\n", bulkResults.Select(r => 
                $"{r.ExtrasNumber},{r.Status},{r.IsValid}"));
        
        await JSRuntime.InvokeVoidAsync("downloadFile", 
            "validari-extrase.csv", csv);
    }
}
```

### 5. Stilizare CSS

```css
/* Container principal */
.validate-extras-extended {
    max-width: 500px;
    margin: 0 auto;
}

/* Rezultat validare */
.validation-result {
    padding: 1rem;
    border-radius: 4px;
}

/* Input număr extras */
.validate-extras-extended .fod-text-field {
    width: 100%;
    margin-bottom: 1rem;
}

/* Butoane */
.validate-extras-extended .fod-button {
    min-width: 120px;
}

/* Istoric validări */
.validation-history-item {
    border-left: 3px solid;
    padding-left: 1rem;
    margin-bottom: 0.5rem;
}

.validation-history-item.valid {
    border-color: var(--fod-palette-success-main);
}

.validation-history-item.invalid {
    border-color: var(--fod-palette-error-main);
}

/* Animație loading */
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

.validating {
    animation: pulse 1.5s infinite;
}
```

### 6. Integrare cu Servicii

#### Implementare serviciu validare
```csharp
public interface IValidateExtrasService
{
    Task<ValidateExtrasModel> ValidateExtras(string extrasNumber);
    Task<List<ValidateExtrasModel>> ValidateBatch(List<string> numbers);
}

public class ValidateExtrasService : IValidateExtrasService
{
    private readonly HttpClient _httpClient;
    
    public async Task<ValidateExtrasModel> ValidateExtras(string extrasNumber)
    {
        var response = await _httpClient.GetAsync(
            $"api/validate-extras/{extrasNumber}");
        
        if (response.IsSuccessStatusCode)
        {
            return await response.Content
                .ReadFromJsonAsync<ValidateExtrasModel>();
        }
        
        return new ValidateExtrasModel
        {
            ExtrasNumber = extrasNumber,
            Status = "Eroare la validare",
            IsValid = false
        };
    }
}
```

### 7. Scenarii de Utilizare

#### Formular cu validare obligatorie
```razor
<EditForm Model="@documentModel" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodTextField Label="Tip document" 
                  @bind-Value="documentModel.DocumentType" />
    
    <div class="my-3">
        <FodValidateExtras @ref="extrasValidator" />
    </div>
    
    <FodButton Type="submit" 
               Color="FodColor.Primary"
               Disabled="@(!IsExtrasValidated)">
        Continuă
    </FodButton>
</EditForm>

@code {
    private DocumentModel documentModel = new();
    private FodValidateExtras extrasValidator;
    
    private bool IsExtrasValidated => 
        extrasValidator?.validateExtrasModel?.IsValid ?? false;
}
```

### 8. Best Practices

1. **Validare format** - Verificați formatul înainte de trimitere
2. **Debounce** - Pentru validare automată la tastare
3. **Cache rezultate** - Evitați validări repetate
4. **Error handling** - Tratați erorile de rețea
5. **Loading state** - Indicați procesarea
6. **Feedback clar** - Mesaje descriptive pentru utilizator

### 9. Performanță

- Cache rezultate validare pentru 5 minute
- Implementați debounce pentru validare automată
- Folosiți validare locală pentru format
- Batch requests pentru validări multiple

### 10. Accesibilitate

- Label clar pentru input
- Mesaje de eroare descriptive
- Suport pentru navigare cu tastatura
- ARIA attributes pentru status

### 11. Troubleshooting

#### Validarea nu funcționează
- Verificați că serviciul este înregistrat în DI
- Verificați endpoint-ul API
- Verificați formatul numărului de extras

#### Rezultate incorecte
- Verificați logica de validare pe server
- Verificați că numărul este complet și corect
- Testați cu numere cunoscute ca valide

### 12. Extensibilitate

```razor
@* ValidateExtrasAdvanced.razor *@
@inherits FodValidateExtras

<!-- Adaugă funcționalități suplimentare -->
<div class="validate-extras-advanced">
    @base.BuildRenderTree(__builder)
    
    @if (validateExtrasModel?.IsValid == true)
    {
        <FodButton Color="FodColor.Info"
                   OnClick="ShowDetails">
            Vezi detalii document
        </FodButton>
    }
</div>

@code {
    [Parameter] public EventCallback<ValidateExtrasModel> OnValidationComplete { get; set; }
    
    protected override async Task ValidateExtras()
    {
        await base.ValidateExtras();
        
        if (validateExtrasModel != null)
        {
            await OnValidationComplete.InvokeAsync(validateExtrasModel);
        }
    }
}
```

### 13. Concluzie

`FodValidateExtras` oferă o soluție simplă și eficientă pentru validarea numerelor de extras din documente oficiale. Cu interfață intuitivă și integrare ușoară, componenta simplifică procesul de verificare a autenticității documentelor în aplicațiile guvernamentale.