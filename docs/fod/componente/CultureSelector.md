# CultureSelector

## Descriere Generală

Componenta `CultureSelector` este o versiune alternativă și mai simplă a selector-ului de limbă, implementată ca un element `<select>` standard. Deși este momentan comentată în codul sursă, oferă aceeași funcționalitate de bază ca LanguageSelector, dar cu o interfață mai simplă și mai accesibilă.

## Status

⚠️ **Componentă dezactivată** - Această componentă este în prezent comentată în codul sursă. Documentația este furnizată pentru referință și posibilă reactivare viitoare.

## Ghid de Utilizare API

### Exemplu de bază (când va fi activată)

```razor
<CultureSelector />
```

### În formular de setări

```razor
<div class="form-group">
    <label>Limba preferată:</label>
    <CultureSelector />
</div>
```

### În toolbar

```razor
<div class="toolbar">
    <div class="toolbar-section">
        <span>Limbă:</span>
        <CultureSelector />
    </div>
</div>
```

## Atribute disponibile

Componenta nu expune parametri publici în implementarea actuală.

## Limbi suportate

Aceleași ca în LanguageSelector:

| Cod cultură | Limba | DisplayName |
|-------------|-------|-------------|
| ro-MD | Română | Română (Republica Moldova) |
| en-US | Engleză | English (United States) |
| ru-RU | Rusă | Русский (Россия) |

## Evenimente

Schimbarea selecției declanșează actualizarea culturii și reîncărcarea paginii.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- IJSRuntime pentru JavaScript interop
- NavigationManager pentru reîncărcare pagină

## Stilizare

### Structura HTML

```html
<label>
    <select>
        <option value="ro-MD">Română (Republica Moldova)</option>
        <option value="en-US">English (United States)</option>
        <option value="ru-RU">Русский (Россия)</option>
    </select>
</label>
```

### Personalizare

```css
/* Select box styling */
.culture-selector select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    min-width: 200px;
}

/* Focus state */
.culture-selector select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
}

/* Option styling (limited browser support) */
.culture-selector option {
    padding: 0.5rem;
}
```

## Diferențe față de LanguageSelector

| Aspect | CultureSelector | LanguageSelector |
|--------|----------------|------------------|
| UI Element | `<select>` nativ | Dropdown custom |
| Complexitate | Simplă | Moderată |
| Accesibilitate | Excelentă (nativă) | Necesită ARIA |
| Stilizare | Limitată | Flexibilă |
| Mobile UX | Nativă OS | Custom |
| Dimensiune cod | Minimă | Moderată |

## Avantaje

1. **Accesibilitate nativă** - Suport complet pentru keyboard și screen readers
2. **Mobile friendly** - Folosește picker-ul nativ al OS-ului
3. **Simplitate** - Cod minimal, ușor de înțeles
4. **No JavaScript** - Pentru afișare (doar pentru schimbare)
5. **Performance** - Fără componente custom sau CSS complex

## Dezavantaje

1. **Stilizare limitată** - Dificil de personalizat vizual
2. **Inconsistență vizuală** - Arată diferit pe fiecare OS/browser
3. **Fără iconițe** - Nu suportă iconițe în opțiuni
4. **Layout fix** - Nu poate fi integrat în meniuri complexe

## Recomandări de utilizare

Folosiți CultureSelector când:
- Accesibilitatea este prioritară
- Designul permite elemente native
- Aplicația este orientată spre mobile
- Simplicitatea este importantă

Folosiți LanguageSelector când:
- Aveți cerințe stricte de design
- Trebuie integrată în header/navbar
- Doriți iconițe și formatare complexă
- Consistența vizuală este critică

## Implementare recomandată

```razor
@using System.Globalization
@using Microsoft.JSInterop
@inject IJSRuntime JSRuntime
@inject NavigationManager NavigationManager

<div class="culture-selector">
    <label>
        <span class="sr-only">Selectați limba</span>
        <select @onchange="OnCultureChanged" value="@CultureInfo.CurrentCulture.Name">
            @foreach (var culture in supportedCultures)
            {
                <option value="@culture.Name">@culture.DisplayName</option>
            }
        </select>
    </label>
</div>

@code {
    private CultureInfo[] supportedCultures = new[]
    {
        new CultureInfo("ro-MD"),
        new CultureInfo("en-US"), 
        new CultureInfo("ru-RU"),
    };

    private async Task OnCultureChanged(ChangeEventArgs e)
    {
        var cultureName = e.Value?.ToString();
        if (!string.IsNullOrEmpty(cultureName))
        {
            await JSRuntime.InvokeVoidAsync("blazorCulture.set", cultureName);
            NavigationManager.NavigateTo(NavigationManager.Uri, forceLoad: true);
        }
    }
}
```

## Concluzie

CultureSelector oferă o alternativă simplă și accesibilă pentru selecția limbii. Deși comentată în prezent, merită considerată pentru aplicații unde simplitatea și accesibilitatea sunt mai importante decât personalizarea vizuală avansată.