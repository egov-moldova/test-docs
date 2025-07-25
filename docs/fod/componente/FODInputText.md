# Input Text

## Documentație pentru componenta FODInputText

### 1. Descriere Generală
`FODInputText` este o componentă de formular pentru introducerea valorilor text care se integrează cu sistemul de formulare și validare Blazor. Suportă diverse funcționalități precum validare, stări de încărcare și gestionare automată a numerelor de identificare moldovenești (IDNP, IDNO, IDNV).

Componenta suportă:
- Validare integrată cu Data Annotations
- Placeholder și label personalizabile
- Stare de încărcare cu indicator vizual
- Mod readonly pentru afișare
- Suport automat pentru IDNP/IDNO/IDNV cu limitare la 13 caractere
- Integrare cu EditForm și ValidationMessage

### 2. Ghid de Utilizare API

#### Input text de bază
```razor
<EditForm Model="model">
    <FODInputText Label="Nume complet" @bind-Value="model.FullName" />
</EditForm>

@code {
    private FormModel model = new();
    
    public class FormModel
    {
        public string FullName { get; set; } = "";
    }
}
```

#### Input cu placeholder și descriere
```razor
<FODInputText 
    Label="Adresa de email" 
    @bind-Value="model.Email" 
    Placeholder="exemplu@domeniu.md"
    Description="Introduceți o adresă de email validă" />
```

#### Input cu validare
```razor
<EditForm Model="validationModel" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FODInputText 
        Label="Nume utilizator" 
        @bind-Value="validationModel.Username" 
        Required="true" />
    
    <FODInputText 
        Label="Email" 
        @bind-Value="validationModel.Email" 
        Placeholder="Introduceți adresa de email" />
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Trimite
    </FodButton>
</EditForm>

@code {
    private ValidationModel validationModel = new();

    public class ValidationModel
    {
        [Required(ErrorMessage = "Numele de utilizator este obligatoriu")]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Numele trebuie să aibă între 3 și 20 caractere")]
        public string Username { get; set; } = "";

        [Required(ErrorMessage = "Email-ul este obligatoriu")]
        [EmailAddress(ErrorMessage = "Format email invalid")]
        public string Email { get; set; } = "";
    }
    
    private void HandleSubmit()
    {
        // Procesare formular
    }
}
```

#### Input cu stare de încărcare
```razor
<FODInputText 
    Label="Caută utilizator" 
    @bind-Value="searchQuery" 
    IsLoading="isSearching"
    OnValueChanged="OnSearchChanged"
    Placeholder="Începeți să tastați pentru a căuta..." />

@code {
    private string searchQuery = "";
    private bool isSearching = false;

    private async Task OnSearchChanged(string value)
    {
        isSearching = true;
        StateHasChanged();
        
        // Simulare apel API
        await Task.Delay(1000);
        
        isSearching = false;
        StateHasChanged();
    }
}
```

#### Input readonly
```razor
<FODInputText 
    Label="ID Utilizator" 
    @bind-Value="model.UserId" 
    Readonly="true"
    Description="Acest câmp este generat automat" />
```

#### Input pentru IDNP
```razor
<EditForm Model="idnpModel">
    <DataAnnotationsValidator />
    
    <FODInputText 
        Label="IDNP (Cod personal)" 
        @bind-Value="idnpModel.Idnp" 
        Placeholder="13 cifre"
        Description="Numărul de identificare personal" />
</EditForm>

@code {
    private IdnpModel idnpModel = new();

    public class IdnpModel
    {
        [Required(ErrorMessage = "IDNP este obligatoriu")]
        [IDNP(ErrorMessage = "Format IDNP invalid")]
        public string Idnp { get; set; } = "";
    }
}
```

#### Input cu formatare specială
```razor
<FODInputText 
    Label="DENUMIREA ORGANIZAȚIEI" 
    @bind-Value="model.OrganizationName"
    LabelUpperCase="true"
    Name="org-name"
    Placeholder="Introduceți denumirea completă"
    Description="Denumirea legală conform certificatului de înregistrare" />
```

#### Formular complet cu validare
```razor
<EditForm Model="formData" OnValidSubmit="SubmitForm">
    <DataAnnotationsValidator />
    <ValidationSummary />
    
    <div class="mb-3">
        <FODInputText 
            Label="Nume și prenume" 
            @bind-Value="formData.FullName" 
            Required="true" />
    </div>
    
    <div class="mb-3">
        <FODInputText 
            Label="Telefon" 
            @bind-Value="formData.Phone" 
            Placeholder="+373 XX XXX XXX"
            Description="Format: +373 XX XXX XXX" />
    </div>
    
    <div class="mb-3">
        <FODInputText 
            Label="Comentarii" 
            @bind-Value="formData.Comments" 
            Placeholder="Opțional (max 200 caractere)"
            RequiredLabel="false" />
    </div>
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Salvează
    </FodButton>
</EditForm>

@code {
    private FormData formData = new();

    public class FormData
    {
        [Required(ErrorMessage = "Numele este obligatoriu")]
        public string FullName { get; set; } = "";

        [Required(ErrorMessage = "Telefonul este obligatoriu")]
        [Phone(ErrorMessage = "Format telefon invalid")]
        public string Phone { get; set; } = "";

        [MaxLength(200, ErrorMessage = "Comentariile nu pot depăși 200 de caractere")]
        public string Comments { get; set; } = "";
    }

    private void SubmitForm()
    {
        // Procesare date formular
    }
}
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `string` | Valoarea curentă a input-ului (two-way binding) | `null` |
| `Label` | `string` | Eticheta afișată deasupra input-ului | `null` |
| `Placeholder` | `string` | Text placeholder afișat când input-ul este gol | `null` |
| `Name` | `string` | Atributul name pentru input | `null` |
| `Required` | `bool?` | Marchează câmpul ca obligatoriu | `null` |
| `RequiredLabel` | `bool` | Afișează indicatorul de câmp obligatoriu (*) | `true` |
| `Readonly` | `bool` | Face input-ul readonly | `false` |
| `Description` | `string` | Text descriptiv afișat sub input | `null` |
| `IsLoading` | `bool` | Afișează indicator de încărcare | `false` |
| `LabelUpperCase` | `bool` | Transformă label-ul în majuscule | `false` |
| `OnValueChanged` | `EventCallback<string>` | Eveniment declanșat la schimbarea valorii | - |
| `CssClass` | `string` | Clase CSS adiționale pentru input | `null` |

### 3. Funcționalități speciale

#### Suport pentru atribute de validare
Componenta detectează automat atributele de validare și le aplică:
- `[Required]` - setează automat mesajul de eroare localizat
- `[MaxLength]` - aplică atributul maxlength pe input
- `[IDNP]`, `[IDNO]`, `[IDNV]` - limitează automat la 13 caractere

#### Integrare cu FODInputWrapper
Componenta folosește `FODInputWrapper` care oferă:
- Layout consistent pentru toate input-urile
- Afișare label cu indicator de obligatoriu
- Afișare descriere
- Integrare cu ValidationMessage

#### Stare de încărcare
Când `IsLoading="true"`:
- Input-ul devine disabled
- Se afișează un indicator de încărcare liniar sub input

### 4. Validare

#### Validare standard
```razor
public class Model
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Name { get; set; }
    
    [EmailAddress]
    public string Email { get; set; }
    
    [Phone]
    public string Phone { get; set; }
}
```

#### Validare pentru IDNP/IDNO
```razor
public class BusinessModel
{
    [IDNP]
    public string PersonalId { get; set; }
    
    [IDNO]
    public string OrganizationId { get; set; }
}
```

### 5. Styling și personalizare

#### Clase CSS personalizate
```razor
<FODInputText 
    Label="Câmp personalizat" 
    @bind-Value="model.CustomField" 
    CssClass="my-custom-input" />

<style>
    .my-custom-input {
        border-color: #4caf50;
        border-width: 2px;
    }
    
    .my-custom-input:focus {
        border-color: #2196f3;
        box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.25);
    }
</style>
```

### 6. Note și observații

- Componenta moștenește de la `FODFormComponent<string>` care extinde `InputBase<string>`
- Validarea se face automat prin integrarea cu Blazor Forms
- Pentru IDNP/IDNO/IDNV, limita de 13 caractere este aplicată automat
- Mesajele de eroare pentru `[Required]` sunt localizate automat
- Componenta suportă toate atributele HTML standard prin `UserAttributes`

### 7. Bune practici

1. **Folosiți întotdeauna cu EditForm** pentru validare completă
2. **Adăugați DataAnnotationsValidator** în EditForm
3. **Specificați placeholder-uri utile** pentru a ghida utilizatorii
4. **Folosiți Description** pentru instrucțiuni suplimentare
5. **Aplicați validări adecvate** în modelul de date
6. **Gestionați stările de încărcare** pentru operații asincrone

### 8. Concluzie
`FODInputText` este componenta fundamentală pentru introducerea textului în formulare Blazor, oferind toate funcționalitățile necesare pentru o experiență de utilizare profesională, inclusiv validare, feedback vizual și suport pentru formate specifice moldovenești.