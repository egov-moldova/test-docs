# NotificationProvider

## Documentație pentru componenta FodNotificationProvider și serviciul asociat

### 1. Descriere Generală
`FodNotificationProvider` este un sistem complet de notificări pentru aplicații Blazor. Oferă notificări temporare de tip toast care apar în colțul ecranului pentru a informa utilizatorii despre diverse evenimente sau stări.

Sistemul include:
- Provider component pentru afișarea notificărilor
- Serviciu pentru gestionarea notificărilor
- Suport pentru diferite severități (Error, Warning, Info, Success)
- Poziționare flexibilă pe ecran
- Durată de afișare configurabilă
- Animații de intrare/ieșire
- Posibilitate de închidere manuală

### 2. Configurare inițială

#### Înregistrare serviciu
```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IFodNotificationService, FodNotificationService>();
```

#### Adăugare provider în layout
```razor
<!-- În MainLayout.razor sau App.razor -->
<FodNotificationProvider />

<!-- Restul aplicației -->
@Body
```

### 3. Utilizare prin serviciu

#### Injectare și utilizare de bază
```razor
@inject IFodNotificationService NotificationService

<FodButton OnClick="ShowSuccessNotification">Arată notificare succes</FodButton>

@code {
    private void ShowSuccessNotification()
    {
        NotificationService.ShowNotification("Operațiune reușită!", FodSeverity.Success);
    }
}
```

#### Notificări cu diferite severități
```razor
@inject IFodNotificationService NotificationService

@code {
    private void ShowNotifications()
    {
        // Succes
        NotificationService.ShowNotification("Datele au fost salvate!", FodSeverity.Success);
        
        // Eroare
        NotificationService.ShowNotification("Eroare la salvarea datelor!", FodSeverity.Error);
        
        // Avertisment
        NotificationService.ShowNotification("Atenție! Verificați datele introduse.", FodSeverity.Warning);
        
        // Informație
        NotificationService.ShowNotification("Procesare în curs...", FodSeverity.Info);
    }
}
```

#### Notificări cu opțiuni avansate
```razor
@inject IFodNotificationService NotificationService

@code {
    private void ShowAdvancedNotification()
    {
        var options = new NotificationOptions
        {
            Duration = 5000, // 5 secunde
            ShowCloseButton = true,
            ShowIcon = true,
            Animation = NotificationAnimation.SlideIn
        };
        
        NotificationService.ShowNotification(
            "Notificare personalizată cu opțiuni", 
            FodSeverity.Info, 
            options
        );
    }
}
```

### 4. Configurare provider

#### Provider cu poziționare personalizată
```razor
<!-- Dreapta sus (implicit) -->
<FodNotificationProvider Position="NotificationPosition.TopRight" />

<!-- Stânga sus -->
<FodNotificationProvider Position="NotificationPosition.TopLeft" />

<!-- Centru sus -->
<FodNotificationProvider Position="NotificationPosition.TopCenter" />

<!-- Dreapta jos -->
<FodNotificationProvider Position="NotificationPosition.BottomRight" />

<!-- Stânga jos -->
<FodNotificationProvider Position="NotificationPosition.BottomLeft" />

<!-- Centru jos -->
<FodNotificationProvider Position="NotificationPosition.BottomCenter" />
```

#### Provider cu configurare globală
```razor
<FodNotificationProvider 
    Position="NotificationPosition.TopRight"
    DefaultDuration="4000"
    MaxNotifications="5"
    ShowNewestOnTop="true"
    PreventDuplicates="true" />
```

### 5. Exemple practice

#### Notificări în formulare
```razor
@inject IFodNotificationService NotificationService

<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <!-- Câmpuri formular -->
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Salvează
    </FodButton>
</EditForm>

@code {
    private async Task HandleSubmit()
    {
        try
        {
            // Salvare date
            await SaveData();
            NotificationService.ShowNotification("Date salvate cu succes!", FodSeverity.Success);
        }
        catch (Exception ex)
        {
            NotificationService.ShowNotification($"Eroare: {ex.Message}", FodSeverity.Error);
        }
    }
}
```

#### Notificări pentru operații asincrone
```razor
@inject IFodNotificationService NotificationService

<FodButton OnClick="ProcessData">Procesează date</FodButton>

@code {
    private async Task ProcessData()
    {
        // Notificare de început
        NotificationService.ShowNotification("Procesare începută...", FodSeverity.Info);
        
        try
        {
            await Task.Delay(3000); // Simulare procesare
            
            // Notificare de succes
            NotificationService.ShowNotification("Procesare finalizată!", FodSeverity.Success);
        }
        catch
        {
            // Notificare de eroare
            NotificationService.ShowNotification("Procesare eșuată!", FodSeverity.Error);
        }
    }
}
```

#### Notificări cu acțiuni
```razor
@inject IFodNotificationService NotificationService

@code {
    private void ShowActionNotification()
    {
        var notification = new NotificationMessage
        {
            Message = "Document nou disponibil",
            Severity = FodSeverity.Info,
            Actions = new List<NotificationAction>
            {
                new NotificationAction
                {
                    Label = "Vizualizează",
                    Action = () => NavigateToDocument()
                },
                new NotificationAction
                {
                    Label = "Descarcă",
                    Action = () => DownloadDocument()
                }
            }
        };
        
        NotificationService.ShowNotification(notification);
    }
}
```

#### Notificări persistente
```razor
@inject IFodNotificationService NotificationService

@code {
    private void ShowPersistentNotification()
    {
        var options = new NotificationOptions
        {
            Duration = 0, // 0 = persistent (nu dispare automat)
            ShowCloseButton = true
        };
        
        NotificationService.ShowNotification(
            "Conexiune pierdută. Reconectare în curs...", 
            FodSeverity.Warning, 
            options
        );
    }
}
```

### 6. Atribute FodNotificationProvider

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Position` | `NotificationPosition` | Poziția notificărilor pe ecran | `TopRight` |
| `DefaultDuration` | `int` | Durata implicită de afișare (ms) | `3000` |
| `MaxNotifications` | `int` | Numărul maxim de notificări afișate simultan | `5` |
| `ShowNewestOnTop` | `bool` | Afișează notificările noi deasupra | `true` |
| `PreventDuplicates` | `bool` | Previne notificări duplicate | `false` |
| `Class` | `string` | Clase CSS adiționale | `null` |

### 7. Metode serviciu IFodNotificationService

| Metodă | Parametri | Descriere |
|--------|-----------|-----------|
| `ShowNotification` | `string message, FodSeverity severity` | Afișează notificare simplă |
| `ShowNotification` | `string message, FodSeverity severity, NotificationOptions options` | Afișează notificare cu opțiuni |
| `ShowNotification` | `NotificationMessage notification` | Afișează notificare complexă |
| `ShowSuccess` | `string message` | Afișează notificare de succes |
| `ShowError` | `string message` | Afișează notificare de eroare |
| `ShowWarning` | `string message` | Afișează notificare de avertisment |
| `ShowInfo` | `string message` | Afișează notificare informativă |
| `Clear` | - | Șterge toate notificările |
| `Remove` | `string notificationId` | Șterge o notificare specifică |

### 8. Stilizare și personalizare

#### CSS personalizat pentru notificări
```css
/* Notificări cu stil personalizat */
.fod-notification-custom {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.fod-notification-success {
    background: linear-gradient(45deg, #4caf50, #66bb6a);
}

.fod-notification-error {
    background: linear-gradient(45deg, #f44336, #ef5350);
}
```

#### Aplicare stil personalizat
```razor
<FodNotificationProvider Class="fod-notification-custom" />
```

### 9. Integrare cu alte componente

#### Cu FodModal
```razor
@inject IFodNotificationService NotificationService

<FodModal Show="showModal" OnClosed="HandleModalClose">
    <!-- Conținut modal -->
</FodModal>

@code {
    private void HandleModalClose()
    {
        showModal = false;
        NotificationService.ShowInfo("Modal închis");
    }
}
```

#### Cu validare formular
```razor
@inject IFodNotificationService NotificationService

<EditForm Model="model" OnInvalidSubmit="HandleInvalidSubmit">
    <!-- Formular -->
</EditForm>

@code {
    private void HandleInvalidSubmit()
    {
        NotificationService.ShowError("Vă rugăm să corectați erorile din formular");
    }
}
```

### 10. Gestionare erori globale

```razor
@inject IFodNotificationService NotificationService

@code {
    protected override void OnInitialized()
    {
        // Înregistrare handler global pentru erori
        AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
        {
            NotificationService.ShowError("A apărut o eroare neașteptată");
        };
    }
}
```

### 11. Note și observații

- Notificările sunt afișate într-un container fix poziționat
- Z-index ridicat pentru a fi deasupra majorității elementelor
- Animații CSS pentru intrare/ieșire
- Suport pentru screen readers prin atribute ARIA
- Thread-safe pentru utilizare din mai multe componente

### 12. Bune practici

1. **Mesaje concise** - Păstrați mesajele scurte și clare
2. **Severitate corectă** - Folosiți severitatea potrivită pentru context
3. **Nu supraîncărcați** - Evitați prea multe notificări simultane
4. **Feedback imediat** - Afișați notificări imediat după acțiuni
5. **Durată adecvată** - Ajustați durata în funcție de importanță
6. **Acțiuni clare** - Pentru notificări cu acțiuni, folosiți etichete descriptive

### 13. Troubleshooting

#### Notificările nu apar
- Verificați că FodNotificationProvider este adăugat în layout
- Verificați că serviciul este înregistrat în DI container
- Verificați z-index-ul în cazul suprapunerilor

#### Notificări duplicate
- Activați `PreventDuplicates="true"` pe provider
- Verificați că nu apelați de mai multe ori metoda

### 14. Concluzie
`FodNotificationProvider` oferă un sistem complet și flexibil pentru afișarea notificărilor în aplicații Blazor, cu o interfață simplă pentru dezvoltatori și o experiență plăcută pentru utilizatori.