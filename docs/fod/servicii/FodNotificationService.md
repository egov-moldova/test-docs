# FodNotificationService

## Descriere Generală

`FodNotificationService` este serviciul principal pentru gestionarea notificărilor în aplicațiile FOD. Oferă funcționalități complete pentru afișarea, gestionarea și configurarea notificărilor de tip toast/snackbar. Serviciul suportă diferite severități, tranziții animate, prevenirea duplicatelor și gestionare automată la navigare.

## Înregistrare

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddScoped<IFodNotificationService, FodNotificationService>();

// Cu configurare personalizată
builder.Services.AddScoped<FodNotificationConfiguration>(sp => 
    new FodNotificationConfiguration
    {
        MaxDisplayedNotifications = 5,
        PreventDuplicates = true,
        ClearAfterNavigation = false
    });
```

## Utilizare de Bază

```razor
@inject IFodNotificationService NotificationService

<FodButton @onclick="ShowNotification">Arată Notificare</FodButton>

@code {
    private void ShowNotification()
    {
        NotificationService.Add("Operațiune realizată cu succes!", FodSeverity.Success);
    }
}
```

## Configurare

### FodNotificationConfiguration

```csharp
public class FodNotificationConfiguration
{
    public int MaxDisplayedNotifications { get; set; } = 5;
    public bool PreventDuplicates { get; set; } = true;
    public bool ClearAfterNavigation { get; set; } = false;
    public int ShowTransitionDuration { get; set; } = 500;
    public int HideTransitionDuration { get; set; } = 500;
    public int VisibleStateDuration { get; set; } = 5000;
    public bool RequireInteraction { get; set; } = false;
}
```

## Metode Principale

### Add

```csharp
FodNotification Add(string message, 
                   FodSeverity severity = FodSeverity.Normal, 
                   Action<FodNotificationOptions> configure = null)
```

### Clear

```csharp
void Clear()
```

### Remove

```csharp
void Remove(FodNotification notification)
```

## Exemple de Utilizare

### Notificări cu Diferite Severități

```razor
@inject IFodNotificationService NotificationService

<div class="notification-examples">
    <FodButton Color="FodColor.Info" @onclick="ShowInfo">
        Info
    </FodButton>
    
    <FodButton Color="FodColor.Success" @onclick="ShowSuccess">
        Success
    </FodButton>
    
    <FodButton Color="FodColor.Warning" @onclick="ShowWarning">
        Warning
    </FodButton>
    
    <FodButton Color="FodColor.Error" @onclick="ShowError">
        Error
    </FodButton>
</div>

@code {
    private void ShowInfo()
    {
        NotificationService.Add("Informație utilă pentru utilizator", FodSeverity.Info);
    }
    
    private void ShowSuccess()
    {
        NotificationService.Add("Operațiune finalizată cu succes!", FodSeverity.Success);
    }
    
    private void ShowWarning()
    {
        NotificationService.Add("Atenție! Verificați datele introduse", FodSeverity.Warning);
    }
    
    private void ShowError()
    {
        NotificationService.Add("Eroare la procesare. Încercați din nou.", FodSeverity.Error);
    }
}
```

### Notificări cu Opțiuni Personalizate

```razor
@inject IFodNotificationService NotificationService

<FodButton @onclick="ShowCustomNotification">
    Notificare Personalizată
</FodButton>

@code {
    private void ShowCustomNotification()
    {
        NotificationService.Add("Click pentru detalii", FodSeverity.Info, options =>
        {
            options.RequireInteraction = true; // Nu se închide automat
            options.ShowCloseIcon = true;
            options.VisibleStateDuration = 10000; // 10 secunde
            options.Onclick = notification =>
            {
                // Acțiune la click
                NavigationManager.NavigateTo("/details");
            };
        });
    }
}
```

### Gestionare Operațiuni Asincrone

```razor
@inject IFodNotificationService NotificationService
@inject IDataService DataService

<FodButton @onclick="SaveData">Salvează</FodButton>

@code {
    private async Task SaveData()
    {
        try
        {
            // Notificare de procesare
            var processingNotification = NotificationService.Add(
                "Se salvează datele...", 
                FodSeverity.Info,
                options => options.RequireInteraction = true
            );
            
            await DataService.SaveAsync(data);
            
            // Înlătură notificarea de procesare
            NotificationService.Remove(processingNotification);
            
            // Afișează succes
            NotificationService.Add("Date salvate cu succes!", FodSeverity.Success);
        }
        catch (Exception ex)
        {
            NotificationService.Add($"Eroare: {ex.Message}", FodSeverity.Error);
        }
    }
}
```

### Notificări cu Acțiuni

```razor
@inject IFodNotificationService NotificationService

<FodButton @onclick="DeleteItem">Șterge</FodButton>

@code {
    private void DeleteItem()
    {
        var item = GetSelectedItem();
        
        // Șterge item-ul
        DeleteFromDatabase(item);
        
        // Notificare cu opțiune de anulare
        NotificationService.Add($"{item.Name} a fost șters", FodSeverity.Info, options =>
        {
            options.ShowCloseIcon = true;
            options.VisibleStateDuration = 8000;
            options.Action = new FodNotificationAction
            {
                Text = "Anulează",
                OnClick = () => 
                {
                    // Restaurează item-ul
                    RestoreItem(item);
                    NotificationService.Add("Ștergerea a fost anulată", FodSeverity.Success);
                }
            };
        });
    }
}
```

### Prevenire Duplicate

```razor
@inject IFodNotificationService NotificationService

<FodButton @onclick="ShowDuplicateTest">
    Test Duplicate
</FodButton>

@code {
    private void ShowDuplicateTest()
    {
        // Cu PreventDuplicates = true, doar prima va fi afișată
        NotificationService.Add("Această notificare apare o singură dată", FodSeverity.Info);
        NotificationService.Add("Această notificare apare o singură dată", FodSeverity.Info);
        NotificationService.Add("Această notificare apare o singură dată", FodSeverity.Info);
    }
}
```

### Integrare cu Formulare

```razor
@inject IFodNotificationService NotificationService

<EditForm Model="@model" OnValidSubmit="@HandleValidSubmit" OnInvalidSubmit="@HandleInvalidSubmit">
    <DataAnnotationsValidator />
    
    <!-- Câmpuri formular -->
    
    <FodButton Type="submit">Trimite</FodButton>
</EditForm>

@code {
    private async Task HandleValidSubmit()
    {
        try
        {
            await SubmitForm();
            NotificationService.Add("Formular trimis cu succes!", FodSeverity.Success);
        }
        catch (Exception ex)
        {
            NotificationService.Add($"Eroare la trimitere: {ex.Message}", FodSeverity.Error);
        }
    }
    
    private void HandleInvalidSubmit()
    {
        NotificationService.Add("Vă rugăm corectați erorile din formular", FodSeverity.Warning);
    }
}
```

### Notificări Grupate

```razor
@inject IFodNotificationService NotificationService

<FodButton @onclick="ProcessBatch">Procesează Lot</FodButton>

@code {
    private async Task ProcessBatch()
    {
        var items = GetItemsToProcess();
        var successCount = 0;
        var errorCount = 0;
        
        foreach (var item in items)
        {
            try
            {
                await ProcessItem(item);
                successCount++;
            }
            catch
            {
                errorCount++;
            }
        }
        
        // Raport final
        if (errorCount == 0)
        {
            NotificationService.Add($"Toate cele {successCount} elemente au fost procesate cu succes!", 
                                  FodSeverity.Success);
        }
        else
        {
            NotificationService.Add($"Procesare completă: {successCount} reușite, {errorCount} eșuate", 
                                  FodSeverity.Warning);
        }
    }
}
```

## Evenimente și Callback-uri

### OnNotificationsUpdated

```csharp
NotificationService.OnNotificationsUpdated += () =>
{
    // Se apelează când lista de notificări se schimbă
    InvokeAsync(StateHasChanged);
};
```

### OnClose (pe Notificare)

```csharp
var notification = NotificationService.Add("Test");
notification.OnClose += (n) =>
{
    Console.WriteLine($"Notificarea '{n.Message}' a fost închisă");
};
```

## Configurare Globală

```csharp
// În Program.cs
services.AddScoped<FodNotificationConfiguration>(sp =>
{
    return new FodNotificationConfiguration
    {
        MaxDisplayedNotifications = 3,
        PreventDuplicates = true,
        ClearAfterNavigation = false,
        ShowTransitionDuration = 300,
        HideTransitionDuration = 300,
        VisibleStateDuration = 5000,
        Position = NotificationPosition.TopRight,
        ShowCloseIcon = true
    };
});
```

## Integrare cu FodNotificationProvider

```razor
<!-- În App.razor sau MainLayout.razor -->
<FodNotificationProvider />

<!-- Conținutul aplicației -->
<Router AppAssembly="@typeof(App).Assembly">
    <!-- ... -->
</Router>
```

## Stilizare Personalizată

```css
/* Stiluri pentru notificări */
.fod-notification {
    min-width: 300px;
    max-width: 500px;
}

.fod-notification-success {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
}

.fod-notification-error {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
}

/* Animații personalizate */
.fod-notification-showing {
    animation: slideIn 0.3s ease-out;
}

.fod-notification-hiding {
    animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
```

## Thread Safety

Serviciul folosește `ReaderWriterLockSlim` pentru operații thread-safe:

```csharp
private ReaderWriterLockSlim NotificationLock { get; }
private IList<FodNotification> NotificationList { get; }
```

## Best Practices

1. **Mesaje clare și concise** - Evitați mesaje lungi
2. **Severitate corectă** - Folosiți severitatea potrivită contextului
3. **Acțiuni pentru erori** - Oferiți utilizatorului opțiuni de remediere
4. **Evitați spam-ul** - Folosiți PreventDuplicates
5. **Feedback imediat** - Notificați imediat după acțiuni
6. **Persistență pentru operații lungi** - RequireInteraction pentru procese importante

## Gestionare Navigare

```csharp
// Configurare comportament la navigare
Configuration.ClearAfterNavigation = true; // Șterge toate notificările

// Sau per notificare
options.CloseAfterNavigation = true; // Închide doar această notificare
```

## Limitări

- Număr maxim de notificări afișate simultan (configurat)
- Nu persistă notificările între refresh-uri de pagină
- Nu suportă notificări complexe cu markup HTML bogat

## Troubleshooting

### Notificările nu apar
- Verificați că `FodNotificationProvider` este adăugat în layout
- Verificați înregistrarea serviciului în DI

### Notificările dispar prea repede
- Ajustați `VisibleStateDuration` în configurare
- Setați `RequireInteraction = true` pentru notificări importante

### Duplicate apar
- Activați `PreventDuplicates` în configurare
- Verificați că mesajele sunt identice (inclusiv spații)

## Concluzie

FodNotificationService oferă un sistem complet și flexibil pentru gestionarea notificărilor în aplicații Blazor, cu suport pentru diferite scenarii de utilizare, de la simple mesaje informative până la notificări complexe cu acțiuni și persistență.