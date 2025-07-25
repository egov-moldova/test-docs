# JsApiService

## Descriere Generală

`JsApiService` este un serviciu utilitar care oferă acces la funcționalități JavaScript comune în aplicații Blazor. Serviciul încapsulează operațiuni frecvent utilizate precum copierea în clipboard și deschiderea de ferestre/tab-uri noi, oferind o interfață .NET simplă pentru aceste funcționalități browser.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IJsApiService, JsApiService>();
```

### JavaScript necesar

```javascript
// Inclus automat în FodComponents.js
window.fodWindow = {
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text);
    },
    
    open: function(url, target) {
        window.open(url, target);
    },
    
    changeCssById: function(id, css) {
        var element = document.getElementById(id);
        if (element) {
            element.className = css;
        }
    },
    
    changeGlobalCssVariable: function(name, newValue) {
        document.documentElement.style.setProperty(name, newValue);
    }
};
```

## Interfața IJsApiService

```csharp
public interface IJsApiService
{
    ValueTask CopyToClipboardAsync(string text);
    ValueTask OpenInNewTabAsync(string url);
    ValueTask Open(string link, string target);
}
```

## Metode disponibile

### CopyToClipboardAsync

Copiază text în clipboard-ul sistemului.

**Parametri:**
- `text: string` - Textul de copiat

**Returnează:** `ValueTask`

**Note:** Necesită HTTPS sau localhost pentru funcționare

### OpenInNewTabAsync

Deschide URL într-un tab nou.

**Parametri:**
- `url: string` - URL-ul de deschis

**Returnează:** `ValueTask`

### Open

Deschide URL cu target specificat.

**Parametri:**
- `link: string` - URL-ul de deschis
- `target: string` - Target window ("_blank", "_self", "_parent", "_top", sau nume fereastră)

**Returnează:** `ValueTask`

## Exemple de utilizare

### Copiere text simplu

```razor
@inject IJsApiService JsApiService

<div class="copy-example">
    <FodInput @bind-Value="textToCopy" Label="Text de copiat" />
    
    <FodButton @onclick="CopyText" Color="FodColor.Primary">
        <FodIcon Icon="content_copy" /> Copiază
    </FodButton>
    
    @if (copied)
    {
        <FodAlert Type="FodAlertType.Success">
            Text copiat în clipboard!
        </FodAlert>
    }
</div>

@code {
    private string textToCopy = "";
    private bool copied = false;
    
    private async Task CopyText()
    {
        await JsApiService.CopyToClipboardAsync(textToCopy);
        copied = true;
        
        // Reset feedback după 2 secunde
        await Task.Delay(2000);
        copied = false;
        StateHasChanged();
    }
}
```

### Copiere date complexe

```razor
@inject IJsApiService JsApiService

<FodDataTable Items="@users" @ref="dataTable">
    <FodColumn Title="Nume" Field="@nameof(User.Name)" />
    <FodColumn Title="Email" Field="@nameof(User.Email)" />
    <FodColumn Title="Acțiuni">
        <Template>
            <FodIconButton Icon="content_copy" 
                          Size="FodSize.Small"
                          @onclick="() => CopyUserData(context)" />
        </Template>
    </FodColumn>
</FodDataTable>

@code {
    private List<User> users = new();
    
    private async Task CopyUserData(User user)
    {
        var userData = $"Nume: {user.Name}\nEmail: {user.Email}\nTelefon: {user.Phone}";
        await JsApiService.CopyToClipboardAsync(userData);
        
        // Notificare
        ShowNotification($"Datele pentru {user.Name} au fost copiate!");
    }
}
```

### Deschidere link-uri externe

```razor
@inject IJsApiService JsApiService

<div class="external-links">
    <FodButton @onclick="OpenDocumentation">
        <FodIcon Icon="help" /> Documentație
    </FodButton>
    
    <FodButton @onclick="OpenSupport">
        <FodIcon Icon="support" /> Suport
    </FodButton>
    
    <FodButton @onclick="() => OpenLink('https://example.com', '_self')">
        Deschide în Aceeași Fereastră
    </FodButton>
</div>

@code {
    private async Task OpenDocumentation()
    {
        await JsApiService.OpenInNewTabAsync("https://docs.example.com");
    }
    
    private async Task OpenSupport()
    {
        await JsApiService.OpenInNewTabAsync("https://support.example.com");
    }
    
    private async Task OpenLink(string url, string target)
    {
        await JsApiService.Open(url, target);
    }
}
```

### Component Share

```razor
@inject IJsApiService JsApiService
@inject NavigationManager NavigationManager

<div class="share-component">
    <h5>Distribuie</h5>
    
    <FodButtonGroup>
        <FodButton @onclick="CopyLink" Variant="FodVariant.Outlined">
            <FodIcon Icon="link" /> Copiază Link
        </FodButton>
        
        <FodButton @onclick="ShareEmail" Variant="FodVariant.Outlined">
            <FodIcon Icon="email" /> Email
        </FodButton>
        
        <FodButton @onclick="ShareWhatsApp" Variant="FodVariant.Outlined">
            <FodIcon Icon="chat" /> WhatsApp
        </FodButton>
    </FodButtonGroup>
</div>

@code {
    [Parameter] public string Title { get; set; } = "";
    [Parameter] public string Description { get; set; } = "";
    
    private string currentUrl => NavigationManager.Uri;
    
    private async Task CopyLink()
    {
        await JsApiService.CopyToClipboardAsync(currentUrl);
        ShowNotification("Link copiat!");
    }
    
    private async Task ShareEmail()
    {
        var subject = Uri.EscapeDataString(Title);
        var body = Uri.EscapeDataString($"{Description}\n\n{currentUrl}");
        await JsApiService.Open($"mailto:?subject={subject}&body={body}", "_self");
    }
    
    private async Task ShareWhatsApp()
    {
        var text = Uri.EscapeDataString($"{Title}\n{Description}\n{currentUrl}");
        await JsApiService.OpenInNewTabAsync($"https://wa.me/?text={text}");
    }
}
```

### Clipboard cu formatare

```razor
@inject IJsApiService JsApiService

<div class="formatted-copy">
    <FodCard>
        <CardContent>
            <h4>@invoice.Number</h4>
            <p>Client: @invoice.ClientName</p>
            <p>Total: @invoice.Total.ToString("C")</p>
        </CardContent>
        <CardActions>
            <FodButton @onclick="CopyAsText">Copiază ca Text</FodButton>
            <FodButton @onclick="CopyAsJson">Copiază ca JSON</FodButton>
            <FodButton @onclick="CopyAsMarkdown">Copiază ca Markdown</FodButton>
        </CardActions>
    </FodCard>
</div>

@code {
    private Invoice invoice = new()
    {
        Number = "INV-2024-001",
        ClientName = "ACME Corp",
        Total = 1500.00m
    };
    
    private async Task CopyAsText()
    {
        var text = $"Factura: {invoice.Number}\n" +
                  $"Client: {invoice.ClientName}\n" +
                  $"Total: {invoice.Total:C}";
        
        await JsApiService.CopyToClipboardAsync(text);
    }
    
    private async Task CopyAsJson()
    {
        var json = System.Text.Json.JsonSerializer.Serialize(invoice, new JsonSerializerOptions 
        { 
            WriteIndented = true 
        });
        
        await JsApiService.CopyToClipboardAsync(json);
    }
    
    private async Task CopyAsMarkdown()
    {
        var markdown = $"## Factura {invoice.Number}\n\n" +
                      $"**Client:** {invoice.ClientName}\n\n" +
                      $"**Total:** {invoice.Total:C}";
        
        await JsApiService.CopyToClipboardAsync(markdown);
    }
}
```

### Service extins cu validare

```csharp
public interface IExtendedJsApiService : IJsApiService
{
    ValueTask<bool> CanCopyToClipboard();
    ValueTask<bool> TryCopyToClipboardAsync(string text);
    ValueTask OpenInNewTabWithFallback(string url, string fallbackUrl);
}

public class ExtendedJsApiService : IExtendedJsApiService
{
    private readonly IJsApiService _innerService;
    private readonly IJSRuntime _jsRuntime;
    private readonly ILogger<ExtendedJsApiService> _logger;
    
    public async ValueTask<bool> CanCopyToClipboard()
    {
        try
        {
            return await _jsRuntime.InvokeAsync<bool>(
                "eval", "navigator.clipboard !== undefined");
        }
        catch
        {
            return false;
        }
    }
    
    public async ValueTask<bool> TryCopyToClipboardAsync(string text)
    {
        try
        {
            await _innerService.CopyToClipboardAsync(text);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to copy to clipboard");
            return false;
        }
    }
    
    public async ValueTask OpenInNewTabWithFallback(string url, string fallbackUrl)
    {
        try
        {
            await _innerService.OpenInNewTabAsync(url);
        }
        catch
        {
            await _innerService.OpenInNewTabAsync(fallbackUrl);
        }
    }
}
```

### Deep linking și navigare

```razor
@inject IJsApiService JsApiService
@inject NavigationManager NavigationManager

<div class="deep-links">
    @foreach (var section in sections)
    {
        <div class="section-link">
            <FodButton @onclick="() => NavigateToSection(section.Id)" 
                      Variant="FodVariant.Text">
                @section.Title
            </FodButton>
            
            <FodIconButton Icon="open_in_new" 
                          Size="FodSize.Small"
                          @onclick="() => OpenSectionInNewTab(section.Id)" />
        </div>
    }
</div>

@code {
    private List<Section> sections = new();
    
    private void NavigateToSection(string sectionId)
    {
        NavigationManager.NavigateTo($"#{sectionId}");
    }
    
    private async Task OpenSectionInNewTab(string sectionId)
    {
        var url = NavigationManager.ToAbsoluteUri($"#{sectionId}").ToString();
        await JsApiService.OpenInNewTabAsync(url);
    }
}
```

## Tratare erori

### Gestionare permisiuni clipboard

```razor
@inject IJsApiService JsApiService
@inject IJSRuntime JSRuntime

<FodButton @onclick="SafeCopyToClipboard">
    Copiază în Siguranță
</FodButton>

@if (!string.IsNullOrEmpty(errorMessage))
{
    <FodAlert Type="FodAlertType.Error">
        @errorMessage
    </FodAlert>
}

@code {
    private string textToCopy = "Text important";
    private string errorMessage = "";
    
    private async Task SafeCopyToClipboard()
    {
        try
        {
            await JsApiService.CopyToClipboardAsync(textToCopy);
            ShowSuccess("Text copiat cu succes!");
        }
        catch (JSException)
        {
            errorMessage = "Nu am putut accesa clipboard-ul. " +
                          "Verificați permisiunile browserului sau folosiți HTTPS.";
            
            // Fallback: selectează textul pentru copiere manuală
            await JSRuntime.InvokeVoidAsync("fodUtils.selectText", "text-to-copy");
        }
    }
}
```

### Blocare popup

```razor
@inject IJsApiService JsApiService

<FodButton @onclick="OpenWithPopupCheck">
    Deschide Link
</FodButton>

@code {
    private string targetUrl = "https://example.com";
    
    private async Task OpenWithPopupCheck()
    {
        try
        {
            await JsApiService.OpenInNewTabAsync(targetUrl);
        }
        catch
        {
            // Popup blocat - afișează mesaj
            ShowWarning($"Popup-ul a fost blocat. " +
                       $"Permiteți popup-uri pentru acest site sau " +
                       $"<a href='{targetUrl}' target='_blank'>click aici</a>");
        }
    }
}
```

## Note tehnice

1. **Clipboard API** - Necesită HTTPS sau localhost pentru securitate
2. **Popup blocking** - Browserele pot bloca window.open dacă nu e inițiat de user
3. **Async operations** - Toate operațiile sunt asincrone
4. **Browser compatibility** - Clipboard API nu e suportat în toate browserele vechi
5. **ValueTask usage** - Folosește ValueTask pentru performanță

## Bune practici

1. **Permission handling** - Verificați permisiunile pentru clipboard
2. **User feedback** - Confirmați acțiunile cu feedback vizual
3. **Fallback options** - Oferiți alternative pentru browsere incompatibile
4. **Security** - Validați URL-urile înainte de deschidere
5. **Error messages** - Mesaje clare pentru utilizatori
6. **Testing** - Testați pe multiple browsere și dispozitive

## Concluzie

JsApiService oferă o interfață simplă și eficientă pentru accesarea funcționalităților JavaScript comune în aplicații Blazor. Cu metode pentru clipboard și gestionarea ferestrelor, serviciul simplifică integrarea cu API-urile browser și îmbunătățește experiența utilizatorului.