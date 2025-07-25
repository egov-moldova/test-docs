# ScrollManager

## Descriere Generală

`ScrollManager` este serviciul responsabil pentru gestionarea operațiunilor de scroll în aplicații Blazor. Oferă metode pentru derularea la elemente specifice, blocarea/deblocarea scroll-ului și navigarea în cadrul paginii cu comportament personalizabil (smooth sau instant).

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IScrollManager, ScrollManager>();

// Asigurați-vă că IJSRuntime este disponibil
// (este înregistrat automat de Blazor)
```

### Configurare JavaScript

```javascript
// Inclus automat în FodComponents.js
window.fodScrollManager = {
    scrollTo: function(selector, left, top, behavior) {
        let element = document.querySelector(selector) || document.documentElement;
        element.scrollTo({ left, top, behavior });
    },
    
    scrollIntoView: function(selector, behavior) {
        let element = document.querySelector(selector) || document.documentElement;
        if (element)
            element.scrollIntoView({ behavior, block: 'center', inline: 'start' });
    },
    
    scrollToBottom: function(selector, behavior) {
        let element = document.querySelector(selector);
        if (element)
            element.scrollTop = element.scrollHeight;
        else
            window.scrollTo(0, document.body.scrollHeight);
    },
    
    lockScroll: function(selector, lockclass) {
        let element = document.querySelector(selector) || document.body;
        let hasScrollBar = window.innerWidth > document.body.clientWidth;
        if (hasScrollBar) {
            element.classList.add(lockclass);
        }
    },
    
    unlockScroll: function(selector, lockclass) {
        let element = document.querySelector(selector) || document.body;
        element.classList.remove(lockclass);
    }
};
```

### CSS pentru lock scroll

```css
/* În site.css sau component.scss */
.scroll-locked {
    overflow: hidden !important;
    padding-right: 17px; /* Compensare pentru scrollbar */
}
```

## Interfața IScrollManager

```csharp
public interface IScrollManager
{
    ValueTask ScrollToAsync(string id, int left, int top, ScrollBehavior scrollBehavior);
    ValueTask ScrollIntoViewAsync(string selector, ScrollBehavior behavior);
    ValueTask ScrollToFragmentAsync(string id, ScrollBehavior behavior);
    ValueTask ScrollToTopAsync(string id, ScrollBehavior scrollBehavior = ScrollBehavior.Auto);
    ValueTask ScrollToYearAsync(string elementId);
    ValueTask ScrollToListItemAsync(string elementId);
    ValueTask LockScrollAsync(string selector = "body", string cssClass = "scroll-locked");
    ValueTask UnlockScrollAsync(string selector = "body", string cssClass = "scroll-locked");
    ValueTask ScrollToBottomAsync(string elementId, ScrollBehavior scrollBehavior = ScrollBehavior.Auto);
}
```

## Enum ScrollBehavior

```csharp
public enum ScrollBehavior
{
    Smooth,  // Derulare animată
    Auto     // Derulare instantanee
}
```

## Metode disponibile

### ScrollToAsync

Derulează la coordonate specifice în cadrul unui element.

**Parametri:**
- `id: string` - ID-ul elementului sau selector CSS
- `left: int` - Poziția orizontală (pixeli)
- `top: int` - Poziția verticală (pixeli)
- `scrollBehavior: ScrollBehavior` - Tipul de animație

**Returnează:** `ValueTask`

### ScrollIntoViewAsync

Derulează elementul în zona vizibilă.

**Parametri:**
- `selector: string` - Selector CSS pentru element
- `behavior: ScrollBehavior` - Tipul de animație

**Returnează:** `ValueTask`

### ScrollToTopAsync

Derulează la începutul elementului.

**Parametri:**
- `id: string` - ID-ul elementului
- `scrollBehavior: ScrollBehavior` - Tipul de animație (default: Auto)

**Returnează:** `ValueTask`

### ScrollToBottomAsync

Derulează la sfârșitul elementului sau al paginii.

**Parametri:**
- `elementId: string` - ID-ul elementului (null pentru pagină)
- `scrollBehavior: ScrollBehavior` - Tipul de animație

**Returnează:** `ValueTask`

### ScrollToYearAsync

Metodă specializată pentru FodDatePicker - derulează la anul selectat.

**Parametri:**
- `elementId: string` - ID-ul elementului anului

**Returnează:** `ValueTask`

### ScrollToListItemAsync

Derulează la un element dintr-o listă.

**Parametri:**
- `elementId: string` - ID-ul elementului din listă

**Returnează:** `ValueTask`

### LockScrollAsync

Blochează scroll-ul pe element.

**Parametri:**
- `selector: string` - Selector CSS (default: "body")
- `cssClass: string` - Clasa CSS aplicată (default: "scroll-locked")

**Returnează:** `ValueTask`

### UnlockScrollAsync

Deblochează scroll-ul pe element.

**Parametri:**
- `selector: string` - Selector CSS (default: "body")
- `cssClass: string` - Clasa CSS de eliminat (default: "scroll-locked")

**Returnează:** `ValueTask`

## Exemple de utilizare

### Navigare la secțiuni

```razor
@inject IScrollManager ScrollManager

<FodButton @onclick="ScrollToSection">Mergi la Secțiune</FodButton>

<div style="height: 1000px;"><!-- Spacer --></div>

<div id="target-section">
    <h2>Secțiune Țintă</h2>
    <p>Conținut secțiune...</p>
</div>

@code {
    private async Task ScrollToSection()
    {
        await ScrollManager.ScrollIntoViewAsync("#target-section", ScrollBehavior.Smooth);
    }
}
```

### Scroll la top cu smooth animation

```razor
@inject IScrollManager ScrollManager

<div id="content-container" style="height: 400px; overflow-y: auto;">
    <!-- Conținut lung -->
    
    <FodButton @onclick="BackToTop" class="back-to-top">
        <FodIcon Icon="arrow-up" /> Sus
    </FodButton>
</div>

@code {
    private async Task BackToTop()
    {
        await ScrollManager.ScrollToTopAsync("content-container", ScrollBehavior.Smooth);
    }
}
```

### Modal cu scroll lock

```razor
@inject IScrollManager ScrollManager

<FodModal @bind-Visible="showModal" OnShow="OnModalShow" OnHide="OnModalHide">
    <HeaderContent>
        <h5>Modal cu Scroll Lock</h5>
    </HeaderContent>
    <BodyContent>
        <p>Când modalul este deschis, scroll-ul paginii este blocat.</p>
    </BodyContent>
</FodModal>

@code {
    private bool showModal;
    
    private async Task OnModalShow()
    {
        await ScrollManager.LockScrollAsync();
    }
    
    private async Task OnModalHide()
    {
        await ScrollManager.UnlockScrollAsync();
    }
}
```

### Chat cu auto-scroll

```razor
@inject IScrollManager ScrollManager

<div id="chat-container" class="chat-window">
    @foreach (var message in messages)
    {
        <div class="message">
            <strong>@message.User:</strong> @message.Text
        </div>
    }
</div>

<FodInput @bind-Value="newMessage" @onkeyup="@OnKeyUp" />

@code {
    private List<ChatMessage> messages = new();
    private string newMessage;
    
    private async Task SendMessage()
    {
        if (!string.IsNullOrWhiteSpace(newMessage))
        {
            messages.Add(new ChatMessage { User = "You", Text = newMessage });
            newMessage = string.Empty;
            
            // Scroll automat la ultimul mesaj
            await ScrollManager.ScrollToBottomAsync("chat-container", ScrollBehavior.Smooth);
        }
    }
    
    private async Task OnKeyUp(KeyboardEventArgs e)
    {
        if (e.Key == "Enter")
        {
            await SendMessage();
        }
    }
}
```

### Navigare în formular lung

```razor
@inject IScrollManager ScrollManager

<div class="form-navigation">
    <FodButton @onclick="() => ScrollToSection('personal-info')">Date Personale</FodButton>
    <FodButton @onclick="() => ScrollToSection('contact-info')">Contact</FodButton>
    <FodButton @onclick="() => ScrollToSection('documents')">Documente</FodButton>
</div>

<EditForm Model="@model" OnValidSubmit="@HandleSubmit">
    <div id="personal-info" class="form-section">
        <h3>Date Personale</h3>
        <!-- Câmpuri formular -->
    </div>
    
    <div id="contact-info" class="form-section">
        <h3>Informații Contact</h3>
        <!-- Câmpuri formular -->
    </div>
    
    <div id="documents" class="form-section">
        <h3>Documente</h3>
        <!-- Upload documente -->
    </div>
</EditForm>

@code {
    private async Task ScrollToSection(string sectionId)
    {
        await ScrollManager.ScrollIntoViewAsync($"#{sectionId}", ScrollBehavior.Smooth);
    }
}
```

### Componenta cu scroll position memory

```razor
@inject IScrollManager ScrollManager
@implements IAsyncDisposable

<div id="scrollable-list" class="list-container" @onscroll="SaveScrollPosition">
    @foreach (var item in items)
    {
        <div class="list-item">@item.Name</div>
    }
</div>

@code {
    private List<Item> items;
    private double savedScrollPosition;
    private Timer scrollDebouncer;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && savedScrollPosition > 0)
        {
            // Restaurare poziție scroll
            await ScrollManager.ScrollToAsync("scrollable-list", 0, 
                (int)savedScrollPosition, ScrollBehavior.Auto);
        }
    }
    
    private void SaveScrollPosition()
    {
        scrollDebouncer?.Dispose();
        scrollDebouncer = new Timer(_ =>
        {
            InvokeAsync(async () =>
            {
                savedScrollPosition = await GetScrollPosition();
            });
        }, null, 300, Timeout.Infinite);
    }
    
    public async ValueTask DisposeAsync()
    {
        scrollDebouncer?.Dispose();
    }
}
```

## Integrare cu componente FOD

### Cu FodDataTable

```razor
@inject IScrollManager ScrollManager

<FodDataTable Items="@items" @ref="dataTable">
    <!-- Coloane -->
</FodDataTable>

<FodButton @onclick="ScrollToSelectedRow">
    Mergi la Rândul Selectat
</FodButton>

@code {
    private FodDataTable<Item> dataTable;
    
    private async Task ScrollToSelectedRow()
    {
        var selectedId = $"row-{dataTable.SelectedItem?.Id}";
        await ScrollManager.ScrollIntoViewAsync($"#{selectedId}", ScrollBehavior.Smooth);
    }
}
```

## Tratare erori

### Service wrapper cu error handling

```csharp
public class SafeScrollManager : IScrollManager
{
    private readonly IScrollManager _innerManager;
    private readonly ILogger<SafeScrollManager> _logger;
    
    public async ValueTask ScrollIntoViewAsync(string selector, ScrollBehavior behavior)
    {
        try
        {
            await _innerManager.ScrollIntoViewAsync(selector, behavior);
        }
        catch (JSException jsEx)
        {
            _logger.LogWarning(jsEx, "Element not found: {Selector}", selector);
            // Fail silently - element nu există
        }
    }
    
    public async ValueTask LockScrollAsync(string selector = "body", string cssClass = "scroll-locked")
    {
        try
        {
            await _innerManager.LockScrollAsync(selector, cssClass);
        }
        catch (TaskCanceledException)
        {
            // Component disposed - ignore
        }
    }
}
```

## Note tehnice

1. **JS Interop** - Toate operațiile folosesc JavaScript pentru manipularea DOM
2. **Async operations** - Toate metodele returnează ValueTask pentru performanță
3. **Ignore errors** - UnlockScrollAsync folosește InvokeVoidAsyncIgnoreErrors
4. **Smooth scrolling** - Suport nativ pentru animații de derulare
5. **Scroll lock** - Verifică existența scrollbar înainte de blocare
6. **Obsolete methods** - Serviciul conține metode deprecate pentru compatibilitate

## Bune practici

1. **Dispose pattern** - Deblocați scroll-ul în Dispose pentru componente modale
2. **Debouncing** - Folosiți debouncing pentru salvarea poziției scroll
3. **Error handling** - Gestionați JSException pentru elemente lipsă
4. **Performance** - Preferați ValueTask pentru operații frecvente
5. **Accessibility** - Mențineți focus management la scroll
6. **Mobile support** - Testați comportamentul pe dispozitive touch

## Concluzie

ScrollManager oferă control complet asupra operațiunilor de scroll în aplicații Blazor, facilitând navigarea fluidă, gestionarea poziției și blocarea scroll-ului. Cu suport pentru animații și metode specializate pentru diverse scenarii, serviciul îmbunătățește experiența utilizatorului în aplicații complexe.