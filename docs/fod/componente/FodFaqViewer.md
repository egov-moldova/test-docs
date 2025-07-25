# FodFaqViewer

## Descriere Generală

`FodFaqViewer` este o componentă pentru afișarea întrebărilor frecvente (FAQ) asociate unui serviciu. Componenta încarcă datele de la un API endpoint, suportă paginare, multilingvism și afișare expandabilă a răspunsurilor. Include componenta `FaqItem` pentru afișarea individuală a fiecărei întrebări.

## Utilizare de Bază

```razor
<!-- FAQ Viewer simplu -->
<FodFaqViewer ServiceId="service-001" />

<!-- FAQ cu titlu personalizat -->
<FodFaqViewer ServiceId="service-001" 
              Title="Întrebări despre serviciul nostru" />

<!-- FAQ fără titlu și cu paginare personalizată -->
<FodFaqViewer ServiceId="service-001"
              HideTitle="true"
              PageSize="10" />
```

## Atribute Disponibile

### FodFaqViewer

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| ServiceId | string | - | ID-ul serviciului (obligatoriu) |
| Title | string | null | Titlu personalizat |
| HideTitle | bool | false | Ascunde titlul |
| PageSize | int | 20 | Număr întrebări per pagină |
| Active | bool | true | Afișează doar FAQ-uri active |
| Class | string | - | Clase CSS adiționale |
| Style | string | - | Stiluri inline |

### FaqItem (componentă internă)

| Atribut | Tip | Default | Descriere |
|---------|-----|---------|-----------|
| Id | string | Guid | ID unic pentru item |
| Question | string | "" | Textul întrebării |
| Answer | string | "" | Textul răspunsului (suportă HTML) |
| IsInitiallyExpanded | bool | false | Expandat inițial |

## Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| OnPageChanged | int | Schimbare pagină internă |

## Modele de Date

### FaqModel

```csharp
public class FaqModel
{
    public List<FaqItemDto> Items { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public int TotalItems { get; set; }
}
```

### FaqItemDto

```csharp
public class FaqItemDto
{
    public LocalizedText Question { get; set; }
    public LocalizedText Answer { get; set; }
    public bool Active { get; set; }
}

public class LocalizedText
{
    public string Ro { get; set; }
    public string Ru { get; set; }
    public string En { get; set; }
}
```

## Exemple Avansate

### FAQ cu Loading și Error States

```razor
<div class="faq-container">
    @if (string.IsNullOrEmpty(serviceId))
    {
        <FodAlert Severity="FodSeverity.Warning">
            Selectați un serviciu pentru a vedea întrebările frecvente.
        </FodAlert>
    }
    else
    {
        <FodFaqViewer ServiceId="@serviceId"
                      Title="@GetFaqTitle()"
                      PageSize="15"
                      Active="showOnlyActive" />
    }
    
    <FodCheckbox @bind-Value="showOnlyActive" 
                 Label="Arată doar FAQ-uri active" />
</div>

@code {
    private string serviceId;
    private bool showOnlyActive = true;
    
    private string GetFaqTitle()
    {
        return $"Întrebări frecvente - {GetServiceName(serviceId)}";
    }
}
```

### FAQ cu Categorii Multiple

```razor
<FodTabs>
    <FodTabPanel Title="Generale">
        <FodFaqViewer ServiceId="general-faq" 
                      HideTitle="true" />
    </FodTabPanel>
    
    <FodTabPanel Title="Tehnice">
        <FodFaqViewer ServiceId="technical-faq" 
                      HideTitle="true" />
    </FodTabPanel>
    
    <FodTabPanel Title="Facturare">
        <FodFaqViewer ServiceId="billing-faq" 
                      HideTitle="true" />
    </FodTabPanel>
</FodTabs>
```

### FAQ Item Personalizat

```razor
<!-- Utilizare directă FaqItem -->
<div class="custom-faq-list">
    @foreach (var faq in customFaqs)
    {
        <div class="mb-3">
            <FaqItem Question="@faq.Question"
                     Answer="@faq.Answer"
                     IsInitiallyExpanded="@faq.IsImportant" />
        </div>
    }
</div>

@code {
    private List<CustomFaq> customFaqs = new()
    {
        new()
        {
            Question = "Cum pot accesa serviciul?",
            Answer = "<p>Pentru a accesa serviciul:</p><ul><li>Autentificați-vă cu MPass</li><li>Selectați serviciul dorit</li><li>Completați formularul</li></ul>",
            IsImportant = true
        },
        new()
        {
            Question = "Care sunt taxele?",
            Answer = "Taxa standard este de <strong>100 MDL</strong>. Pentru urgență: <strong>200 MDL</strong>.",
            IsImportant = false
        }
    };
    
    private class CustomFaq
    {
        public string Question { get; set; }
        public string Answer { get; set; }
        public bool IsImportant { get; set; }
    }
}
```

### FAQ cu Căutare

```razor
<div class="faq-search-container">
    <FodInput @bind-Value="searchQuery"
              Label="Căutați în întrebări"
              Immediate="true"
              DebounceInterval="300"
              OnDebounceIntervalElapsed="@FilterFaqs" />
    
    @if (filteredFaqs.Any())
    {
        <div class="mt-4">
            @foreach (var faq in filteredFaqs)
            {
                <FaqItem Question="@faq.Question"
                         Answer="@faq.Answer" />
            }
        </div>
    }
    else if (!string.IsNullOrWhiteSpace(searchQuery))
    {
        <FodAlert Severity="FodSeverity.Info" Class="mt-4">
            Nu s-au găsit întrebări pentru "@searchQuery"
        </FodAlert>
    }
    
    <div class="mt-5">
        <h4>Toate întrebările</h4>
        <FodFaqViewer ServiceId="@currentServiceId" />
    </div>
</div>

@code {
    private string searchQuery;
    private string currentServiceId = "service-001";
    private List<FaqSearchResult> allFaqs = new();
    private List<FaqSearchResult> filteredFaqs = new();
    
    private async Task FilterFaqs()
    {
        if (string.IsNullOrWhiteSpace(searchQuery))
        {
            filteredFaqs.Clear();
            return;
        }
        
        filteredFaqs = allFaqs
            .Where(f => f.Question.Contains(searchQuery, StringComparison.OrdinalIgnoreCase) ||
                       f.Answer.Contains(searchQuery, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}
```

### FAQ cu Statistici și Feedback

```razor
<div class="faq-with-stats">
    <FodFaqViewer ServiceId="@serviceId" @ref="faqViewer" />
    
    <div class="faq-feedback mt-4 p-3 border rounded">
        <h5>Ați găsit informația utilă?</h5>
        <div class="btn-group">
            <FodButton Color="FodColor.Success" 
                       Variant="FodVariant.Outlined"
                       @onclick="() => SubmitFeedback(true)">
                <FodIcon Icon="thumb_up" /> Da
            </FodButton>
            <FodButton Color="FodColor.Error" 
                       Variant="FodVariant.Outlined"
                       @onclick="() => SubmitFeedback(false)">
                <FodIcon Icon="thumb_down" /> Nu
            </FodButton>
        </div>
        
        @if (showFeedbackForm)
        {
            <div class="mt-3">
                <FodTextArea @bind-Value="feedbackComment"
                             Label="Cum putem îmbunătăți?"
                             Rows="3" />
                <FodButton @onclick="SubmitDetailedFeedback" 
                           Class="mt-2">
                    Trimite Feedback
                </FodButton>
            </div>
        }
    </div>
</div>

@code {
    private string serviceId = "service-001";
    private FodFaqViewer faqViewer;
    private bool showFeedbackForm;
    private string feedbackComment;
    
    private async Task SubmitFeedback(bool wasHelpful)
    {
        if (!wasHelpful)
        {
            showFeedbackForm = true;
        }
        else
        {
            await SaveFeedback(wasHelpful, null);
        }
    }
    
    private async Task SubmitDetailedFeedback()
    {
        await SaveFeedback(false, feedbackComment);
        showFeedbackForm = false;
        feedbackComment = "";
    }
}
```

### FAQ Multilingv Personalizat

```razor
<div class="multilingual-faq">
    <div class="language-selector mb-3">
        <FodButtonGroup>
            <FodButton Variant="@GetLanguageVariant("ro")"
                       @onclick='() => currentLanguage = "ro"'>
                RO
            </FodButton>
            <FodButton Variant="@GetLanguageVariant("ru")"
                       @onclick='() => currentLanguage = "ru"'>
                RU
            </FodButton>
            <FodButton Variant="@GetLanguageVariant("en")"
                       @onclick='() => currentLanguage = "en"'>
                EN
            </FodButton>
        </FodButtonGroup>
    </div>
    
    @foreach (var faq in multilingualFaqs)
    {
        <FaqItem Question="@GetLocalizedText(faq.Question)"
                 Answer="@GetLocalizedText(faq.Answer)" />
    }
</div>

@code {
    private string currentLanguage = "ro";
    private List<MultilingualFaq> multilingualFaqs = new();
    
    private string GetLocalizedText(LocalizedText text)
    {
        return currentLanguage switch
        {
            "ro" => text.Ro,
            "ru" => text.Ru,
            "en" => text.En,
            _ => text.Ro
        };
    }
    
    private FodVariant GetLanguageVariant(string lang)
    {
        return lang == currentLanguage ? FodVariant.Filled : FodVariant.Outlined;
    }
}
```

## API Endpoint

Componenta așteaptă un endpoint cu următoarea structură:

```
GET /api/faq-items?serviceId={serviceId}&pageSize={pageSize}&active={active}&page={page}
```

Răspuns așteptat:
```json
{
    "items": [
        {
            "question": {
                "ro": "Întrebare în română",
                "ru": "Вопрос на русском",
                "en": "Question in English"
            },
            "answer": {
                "ro": "Răspuns în română",
                "ru": "Ответ на русском",
                "en": "Answer in English"
            }
        }
    ],
    "totalPages": 5,
    "currentPage": 1,
    "totalItems": 100
}
```

## Stilizare

### Clase CSS

```css
.faq-item
.card
.card-header
.card-title
.accordion-toggle
.collapse
.card-body
```

### Personalizare Aspect

```css
/* FAQ Item personalizat */
.faq-item .card {
    border: 1px solid #e0e0e0;
    margin-bottom: 10px;
    border-radius: 8px;
}

.faq-item .card-header {
    background-color: #f8f9fa;
    border-bottom: none;
    padding: 1rem;
}

.faq-item .accordion-toggle {
    color: var(--fod-primary);
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
    border: none;
    background: none;
    padding: 0;
}

.faq-item .accordion-toggle:after {
    content: '+';
    font-size: 1.5rem;
    transition: transform 0.3s ease;
}

.faq-item .accordion-toggle[aria-expanded="true"]:after {
    transform: rotate(45deg);
}

.faq-item .card-body {
    padding: 1rem;
    background-color: #ffffff;
}
```

## Note și Observații

1. **ServiceId Required** - Componenta necesită ServiceId pentru a funcționa
2. **HTML Support** - Răspunsurile suportă markup HTML
3. **Localization** - Suport complet pentru RO/RU/EN
4. **Pagination** - Paginare automată pentru liste lungi
5. **Loading State** - Indicator de încărcare integrat

## Bune Practici

1. Setați un PageSize rezonabil (10-20 întrebări)
2. Folosiți HTML semantic în răspunsuri
3. Păstrați întrebările concise și clare
4. Grupați FAQ-uri similare împreună
5. Actualizați regular conținutul
6. Monitorizați feedback-ul utilizatorilor
7. Optimizați pentru SEO cu markup structurat

## Concluzie

FodFaqViewer oferă o soluție completă pentru afișarea întrebărilor frecvente cu suport pentru multilingvism, paginare și expandare/colapsare. Componenta este ideală pentru secțiuni de ajutor și documentație în aplicații guvernamentale.