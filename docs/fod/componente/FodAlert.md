# Alert

## Documentație pentru componenta FodAlert

### 1. Descriere Generală
`FodAlert` este o componentă folosită pentru afișarea mesajelor importante către utilizatori. Poate fi utilizată pentru a comunica informații, avertismente, erori sau mesaje de succes într-un mod vizual distinct și accesibil.

Componenta suportă:
- Multiple severități (Error, Warning, Info, Success)
- Variante de stil (Filled, Outlined, Text)
- Pictograme personalizabile
- Opțiune de închidere
- Conținut personalizabil prin RenderFragment
- Stiluri Dense și Square

### 2. Ghid de Utilizare API

#### Alert de bază
```razor
<FodAlert Severity="FodSeverity.Info">
    Acesta este un mesaj informativ pentru utilizator.
</FodAlert>
```

#### Alerte cu diferite severități
```razor
<FodAlert Severity="FodSeverity.Error">
    Eroare: Vă rugăm să verificați datele introduse.
</FodAlert>

<FodAlert Severity="FodSeverity.Warning">
    Atenție: Această acțiune nu poate fi anulată.
</FodAlert>

<FodAlert Severity="FodSeverity.Info">
    Informație: Sistemul va fi în mentenanță între orele 22:00-24:00.
</FodAlert>

<FodAlert Severity="FodSeverity.Success">
    Succes: Datele au fost salvate cu succes!
</FodAlert>
```

#### Alerte cu diferite variante
```razor
<!-- Filled (implicit) -->
<FodAlert Severity="FodSeverity.Error" Variant="FodVariant.Filled">
    Alert cu fundal colorat
</FodAlert>

<!-- Outlined -->
<FodAlert Severity="FodSeverity.Warning" Variant="FodVariant.Outlined">
    Alert cu chenar colorat
</FodAlert>

<!-- Text -->
<FodAlert Severity="FodSeverity.Info" Variant="FodVariant.Text">
    Alert doar cu text colorat
</FodAlert>
```

#### Alert care poate fi închis
```razor
@if (showAlert)
{
    <FodAlert Severity="FodSeverity.Success" OnClose="@(() => showAlert = false)">
        Mesaj de succes care poate fi închis
    </FodAlert>
}

@code {
    private bool showAlert = true;
}
```

#### Alert cu pictogramă personalizată
```razor
<FodAlert Severity="FodSeverity.Info" Icon="@FodIcons.Material.Filled.Notifications">
    Notificare: Aveți 5 mesaje necitite
</FodAlert>

<FodAlert Severity="FodSeverity.Warning" Icon="@FodIcons.Material.Filled.Schedule">
    Termen limită: 24 ore rămase
</FodAlert>
```

#### Alert fără pictogramă
```razor
<FodAlert Severity="FodSeverity.Info" NoIcon="true">
    Alert simplu fără pictogramă
</FodAlert>
```

#### Alert cu stil dens
```razor
<FodAlert Severity="FodSeverity.Info" Dense="true">
    Alert compact cu padding redus
</FodAlert>
```

#### Alert cu colțuri drepte
```razor
<FodAlert Severity="FodSeverity.Warning" Square="true">
    Alert cu colțuri drepte (fără border-radius)
</FodAlert>
```

#### Alert cu conținut complex
```razor
<FodAlert Severity="FodSeverity.Error" Variant="FodVariant.Outlined">
    <AlertIcon><FodIcon Icon="@FodIcons.Material.Filled.Error" /></AlertIcon>
    <FodText>
        <strong>Erori de validare:</strong>
        <ul class="mb-0 mt-2">
            <li>Câmpul "Nume" este obligatoriu</li>
            <li>Adresa de email nu este validă</li>
            <li>Parola trebuie să conțină minimum 8 caractere</li>
        </ul>
    </FodText>
</FodAlert>
```

#### Alert în context de formular
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    @if (!string.IsNullOrEmpty(errorMessage))
    {
        <FodAlert Severity="FodSeverity.Error" Class="mb-3" OnClose="@(() => errorMessage = null)">
            @errorMessage
        </FodAlert>
    }
    
    @if (submitSuccess)
    {
        <FodAlert Severity="FodSeverity.Success" Class="mb-3">
            Formularul a fost trimis cu succes!
        </FodAlert>
    }
    
    <!-- Câmpuri formular -->
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Trimite
    </FodButton>
</EditForm>

@code {
    private Model model = new();
    private string? errorMessage;
    private bool submitSuccess = false;
    
    private async Task HandleSubmit()
    {
        try
        {
            // Procesare formular
            submitSuccess = true;
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
        }
    }
}
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Severity` | `FodSeverity` | Severitatea alertei (Error, Warning, Info, Success) | `FodSeverity.Info` |
| `Variant` | `FodVariant` | Stilul alertei (Filled, Outlined, Text) | `FodVariant.Filled` |
| `Dense` | `bool` | Reduce padding-ul pentru o variantă mai compactă | `false` |
| `Square` | `bool` | Elimină border-radius pentru colțuri drepte | `false` |
| `NoIcon` | `bool` | Ascunde pictograma implicită | `false` |
| `Icon` | `string` | Pictogramă personalizată | Bazată pe severitate |
| `ShowCloseIcon` | `bool` | Afișează pictograma de închidere când OnClose este setat | `true` |
| `CloseIcon` | `string` | Pictogramă personalizată pentru închidere | Icon implicit |
| `OnClose` | `EventCallback<FodAlert>` | Eveniment declanșat la închiderea alertei | - |
| `ChildContent` | `RenderFragment` | Conținutul alertei | - |
| `AlertIcon` | `RenderFragment` | Conținut personalizat pentru zona pictogramei | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri CSS inline | `null` |

### 3. Pictograme implicite per severitate

| Severitate | Pictogramă implicită |
|------------|---------------------|
| Error | FodIcons.Material.Filled.ErrorOutline |
| Warning | FodIcons.Material.Outlined.ReportProblemOutlined |
| Info | FodIcons.Material.Outlined.InfoOutlined |
| Success | FodIcons.Material.Outlined.CheckCircleOutline |

### 4. Culori per severitate

Culorile sunt determinate automat în funcție de severitate:
- **Error**: Roșu
- **Warning**: Portocaliu
- **Info**: Albastru
- **Success**: Verde

### 5. Cazuri de utilizare

#### Feedback după acțiuni
```razor
@if (actionCompleted)
{
    <FodAlert Severity="FodSeverity.Success" OnClose="@(() => actionCompleted = false)">
        Acțiunea a fost completată cu succes!
    </FodAlert>
}
```

#### Mesaje de sistem
```razor
<FodAlert Severity="FodSeverity.Warning" Icon="@FodIcons.Material.Filled.Update">
    Sistemul va fi actualizat în curând. Vă rugăm să salvați lucrul în curs.
</FodAlert>
```

#### Validare formular
```razor
@if (validationErrors.Any())
{
    <FodAlert Severity="FodSeverity.Error">
        <FodText>
            Vă rugăm să corectați următoarele erori:
            @foreach (var error in validationErrors)
            {
                <br />• @error
            }
        </FodText>
    </FodAlert>
}
```

### 6. Integrare cu notificări temporare

```razor
@if (notifications.Any())
{
    <div class="notifications-container">
        @foreach (var notification in notifications)
        {
            <FodAlert 
                Severity="@notification.Severity" 
                Class="mb-2"
                OnClose="@(() => RemoveNotification(notification))">
                @notification.Message
            </FodAlert>
        }
    </div>
}

@code {
    private List<Notification> notifications = new();
    
    public class Notification
    {
        public string Message { get; set; }
        public FodSeverity Severity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    private void AddNotification(string message, FodSeverity severity)
    {
        var notification = new Notification 
        { 
            Message = message, 
            Severity = severity,
            CreatedAt = DateTime.Now
        };
        
        notifications.Add(notification);
        
        // Auto-remove după 5 secunde
        Task.Delay(5000).ContinueWith(_ => 
        {
            InvokeAsync(() => 
            {
                RemoveNotification(notification);
                StateHasChanged();
            });
        });
    }
    
    private void RemoveNotification(Notification notification)
    {
        notifications.Remove(notification);
    }
}
```

### 7. Note și observații

- Alertele sunt elemente statice, pentru notificări temporare considerați folosirea FodNotificationProvider
- Pictograma de închidere apare automat când OnClose este setat
- Pentru accesibilitate, alertele folosesc atribute ARIA corespunzătoare
- Stilul Dense este util în spații limitate sau pentru liste de alerte

### 8. Bune practici

1. **Folosiți severitatea corectă** pentru context
2. **Păstrați mesajele concise** și clare
3. **Oferiți opțiunea de închidere** pentru alerte non-critice
4. **Poziționați alertele vizibil** la începutul formularelor sau secțiunilor
5. **Folosiți pictograme relevante** pentru context suplimentar
6. **Evitați supraîncărcarea** cu prea multe alerte simultane

### 9. Concluzie
`FodAlert` este o componentă esențială pentru comunicarea cu utilizatorii, oferind flexibilitate în prezentarea diferitelor tipuri de mesaje într-un mod consistent și accesibil în aplicațiile Blazor.