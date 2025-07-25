# Modal

## Documentație pentru componenta FodModal

### 1. Descriere Generală
`FodModal` este o componentă dialog modală care afișează conținut deasupra paginii principale. Este utilă pentru confirmări, formulare, detalii suplimentare sau orice conținut care necesită atenția imediată a utilizatorului.

Componenta suportă:
- Header, body și footer personalizabile
- Diferite dimensiuni (small, medium, large, extra-large)
- Mod fullscreen
- Backdrop personalizabil
- Animații de deschidere/închidere
- Scroll pentru conținut lung
- Centrare verticală opțională

### 2. Ghid de Utilizare API

#### Modal de bază
```razor
@if (showModal)
{
    <FodModal Show="true" OnClosed="@(() => showModal = false)">
        <HeaderTemplate>
            <FodText Typo="Typo.h5">Titlu Modal</FodText>
        </HeaderTemplate>
        <BodyTemplate>
            <FodText>Acesta este conținutul modalului.</FodText>
        </BodyTemplate>
        <FooterTemplate>
            <FodButton Variant="FodVariant.Text" OnClick="@(() => showModal = false)">Anulează</FodButton>
            <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary">Confirmă</FodButton>
        </FooterTemplate>
    </FodModal>
}

<FodButton OnClick="@(() => showModal = true)">Deschide Modal</FodButton>

@code {
    private bool showModal = false;
}
```

#### Modal cu diferite dimensiuni
```razor
<!-- Small -->
<FodModal Show="showSmallModal" Size="FodModalSize.Small" OnClosed="CloseModals">
    <BodyTemplate>
        <FodText>Modal mic pentru conținut scurt</FodText>
    </BodyTemplate>
</FodModal>

<!-- Medium (implicit) -->
<FodModal Show="showMediumModal" Size="FodModalSize.Medium" OnClosed="CloseModals">
    <BodyTemplate>
        <FodText>Modal de dimensiune medie</FodText>
    </BodyTemplate>
</FodModal>

<!-- Large -->
<FodModal Show="showLargeModal" Size="FodModalSize.Large" OnClosed="CloseModals">
    <BodyTemplate>
        <FodText>Modal mare pentru conținut extins</FodText>
    </BodyTemplate>
</FodModal>

<!-- Extra Large -->
<FodModal Show="showXLModal" Size="FodModalSize.ExtraLarge" OnClosed="CloseModals">
    <BodyTemplate>
        <FodText>Modal extra mare</FodText>
    </BodyTemplate>
</FodModal>
```

#### Modal fullscreen
```razor
<!-- Fullscreen întotdeauna -->
<FodModal Show="showFullscreen" Fullscreen="ModalFullscreen.Always" OnClosed="CloseModal">
    <HeaderTemplate>
        <FodText Typo="Typo.h5">Modal Fullscreen</FodText>
    </HeaderTemplate>
    <BodyTemplate>
        <FodText>Acest modal ocupă tot ecranul</FodText>
    </BodyTemplate>
</FodModal>

<!-- Fullscreen sub anumite dimensiuni -->
<FodModal Show="showResponsive" Fullscreen="ModalFullscreen.SmallDown" OnClosed="CloseModal">
    <BodyTemplate>
        <FodText>Fullscreen pe dispozitive mici, normal pe desktop</FodText>
    </BodyTemplate>
</FodModal>
```

#### Modal cu formular
```razor
<FodModal Show="showFormModal" OnClosed="@(() => showFormModal = false)">
    <HeaderTemplate>
        <FodText Typo="Typo.h5">Adaugă utilizator nou</FodText>
    </HeaderTemplate>
    <BodyTemplate>
        <EditForm Model="userModel" OnValidSubmit="SaveUser">
            <DataAnnotationsValidator />
            
            <div class="mb-3">
                <FODInputText Label="Nume" @bind-Value="userModel.Name" />
            </div>
            
            <div class="mb-3">
                <FODInputText Label="Email" @bind-Value="userModel.Email" />
            </div>
            
            <div class="mb-3">
                <FODInputSelect Label="Rol" @bind-Value="userModel.Role">
                    <option value="">Selectați...</option>
                    <option value="admin">Administrator</option>
                    <option value="user">Utilizator</option>
                </FODInputSelect>
            </div>
        </EditForm>
    </BodyTemplate>
    <FooterTemplate>
        <FodButton Variant="FodVariant.Text" OnClick="@(() => showFormModal = false)">
            Anulează
        </FodButton>
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary" Type="submit" Form="userForm">
            Salvează
        </FodButton>
    </FooterTemplate>
</FodModal>

@code {
    private bool showFormModal = false;
    private UserModel userModel = new();
    
    private async Task SaveUser()
    {
        // Salvare utilizator
        showFormModal = false;
    }
}
```

#### Modal cu conținut scrollabil
```razor
<FodModal Show="showScrollable" Scrollable="true" OnClosed="CloseModal">
    <HeaderTemplate>
        <FodText Typo="Typo.h5">Termeni și Condiții</FodText>
    </HeaderTemplate>
    <BodyTemplate>
        <FodText>
            <!-- Conținut lung care va avea scroll -->
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            [mult text aici]
        </FodText>
    </BodyTemplate>
    <FooterTemplate>
        <FodButton Variant="FodVariant.Text" OnClick="DeclineTerms">Refuz</FodButton>
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary" OnClick="AcceptTerms">
            Accept
        </FodButton>
    </FooterTemplate>
</FodModal>
```

#### Modal centrat vertical
```razor
<FodModal Show="showCentered" Centered="true" OnClosed="CloseModal">
    <BodyTemplate>
        <div class="text-center">
            <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" 
                     Color="FodColor.Success" 
                     Size="FodSize.XXLarge" />
            <FodText Typo="Typo.h5" Class="mt-3">Operațiune reușită!</FodText>
            <FodText>Datele au fost salvate cu succes.</FodText>
        </div>
    </BodyTemplate>
    <FooterTemplate>
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Primary" OnClick="CloseModal">
            OK
        </FodButton>
    </FooterTemplate>
</FodModal>
```

#### Modal de confirmare
```razor
<FodModal Show="showConfirmation" Size="FodModalSize.Small" OnClosed="CancelDelete">
    <HeaderTemplate>
        <FodText Typo="Typo.h6">Confirmare ștergere</FodText>
    </HeaderTemplate>
    <BodyTemplate>
        <FodAlert Severity="FodSeverity.Warning" Dense="true">
            Sunteți sigur că doriți să ștergeți acest element? Această acțiune nu poate fi anulată.
        </FodAlert>
    </BodyTemplate>
    <FooterTemplate>
        <FodButton Variant="FodVariant.Text" OnClick="CancelDelete">
            Anulează
        </FodButton>
        <FodButton Variant="FodVariant.Filled" Color="FodColor.Error" OnClick="ConfirmDelete">
            Șterge
        </FodButton>
    </FooterTemplate>
</FodModal>
```

#### Modal cu conținut dinamic
```razor
<FodModal Show="showDynamic" OnClosed="CloseModal">
    <HeaderTemplate>
        <FodText Typo="Typo.h5">@modalTitle</FodText>
    </HeaderTemplate>
    <BodyTemplate>
        @if (isLoading)
        {
            <div class="d-flex justify-content-center p-4">
                <FodLoadingCircular />
            </div>
        }
        else
        {
            <FodText>@modalContent</FodText>
        }
    </BodyTemplate>
</FodModal>

@code {
    private bool showDynamic = false;
    private bool isLoading = true;
    private string modalTitle = "Încărcare...";
    private string modalContent = "";
    
    private async Task LoadModalContent()
    {
        showDynamic = true;
        isLoading = true;
        
        // Simulare încărcare date
        await Task.Delay(2000);
        
        modalTitle = "Date încărcate";
        modalContent = "Conținutul a fost încărcat cu succes!";
        isLoading = false;
    }
}
```

### Atribute disponibile

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Show` | `bool` | Controlează vizibilitatea modalului | `false` |
| `Size` | `FodModalSize` | Dimensiunea modalului (Small, Medium, Large, ExtraLarge) | `Medium` |
| `Fullscreen` | `ModalFullscreen` | Mod fullscreen (Always, SmallDown, MediumDown, LargeDown, ExtraLargeDown, Never) | `Never` |
| `Centered` | `bool` | Centrează vertical modalul | `false` |
| `Scrollable` | `bool` | Permite scroll în body când conținutul depășește înălțimea | `false` |
| `ShowBackdrop` | `bool` | Afișează backdrop-ul întunecat | `true` |
| `ShowCloseButton` | `bool` | Afișează butonul X de închidere | `true` |
| `DisableBackdropClick` | `bool` | Dezactivează închiderea la click pe backdrop | `false` |
| `DisableEscapeKeyDown` | `bool` | Dezactivează închiderea cu tasta ESC | `false` |
| `HeaderTemplate` | `RenderFragment` | Conținutul header-ului | `null` |
| `BodyTemplate` | `RenderFragment` | Conținutul body-ului | `null` |
| `FooterTemplate` | `RenderFragment` | Conținutul footer-ului | `null` |
| `OnClosed` | `EventCallback` | Eveniment declanșat la închiderea modalului | - |
| `HeaderCssClass` | `string` | Clase CSS pentru header | `null` |
| `BodyCssClass` | `string` | Clase CSS pentru body | `null` |
| `FooterCssClass` | `string` | Clase CSS pentru footer | `null` |

### 3. Dimensiuni disponibile

| Dimensiune | Lățime maximă | Utilizare |
|------------|---------------|-----------|
| `Small` | 300px | Confirmări simple, mesaje scurte |
| `Medium` | 500px | Formulare standard, conținut mediu |
| `Large` | 800px | Conținut extins, tabele |
| `ExtraLarge` | 1140px | Conținut foarte mare, vizualizări complexe |

### 4. Moduri Fullscreen

| Mod | Descriere |
|-----|-----------|
| `Always` | Întotdeauna fullscreen |
| `SmallDown` | Fullscreen pe dispozitive <= 576px |
| `MediumDown` | Fullscreen pe dispozitive <= 768px |
| `LargeDown` | Fullscreen pe dispozitive <= 992px |
| `ExtraLargeDown` | Fullscreen pe dispozitive <= 1200px |
| `Never` | Niciodată fullscreen |

### 5. Gestionarea stării

#### Pattern cu show/hide
```razor
@code {
    private bool showModal = false;
    
    private void OpenModal() => showModal = true;
    private void CloseModal() => showModal = false;
}
```

#### Pattern cu multiple modale
```razor
@code {
    private enum ModalType { None, Add, Edit, Delete }
    private ModalType activeModal = ModalType.None;
    
    private void OpenModal(ModalType type) => activeModal = type;
    private void CloseModal() => activeModal = ModalType.None;
}

<!-- În markup -->
<FodModal Show="@(activeModal == ModalType.Add)" OnClosed="CloseModal">
    <!-- Conținut adăugare -->
</FodModal>

<FodModal Show="@(activeModal == ModalType.Edit)" OnClosed="CloseModal">
    <!-- Conținut editare -->
</FodModal>
```

### 6. Integrare cu servicii

```razor
@inject IFodNotificationService NotificationService

<FodModal Show="showModal" OnClosed="HandleModalClose">
    <!-- Conținut modal -->
</FodModal>

@code {
    private async Task HandleModalClose()
    {
        showModal = false;
        await NotificationService.ShowNotification("Modal închis", FodSeverity.Info);
    }
}
```

### 7. Note și observații

- Modalul folosește Bootstrap Modal în fundal
- Un singur modal activ este recomandat la un moment dat
- Pentru notificări simple, considerați FodNotificationProvider
- Body-ul paginii primește class "modal-open" când modalul este deschis
- Z-index-ul modalului este gestionat automat

### 8. Bune practici

1. **Titluri clare** - Folosiți titluri descriptive în header
2. **Acțiuni evidente** - Butoanele din footer să fie clare (Anulează/Confirmă)
3. **Dimensiune adecvată** - Alegeți dimensiunea potrivită pentru conținut
4. **Loading states** - Afișați indicatori de încărcare pentru operații asincrone
5. **Validare** - Validați formularele înainte de a permite închiderea
6. **Confirmare** - Pentru acțiuni distructive, folosiți un modal de confirmare

### 9. Accesibilitate

- Focus trap - focusul rămâne în modal când este deschis
- Tasta ESC închide modalul (dacă nu este dezactivată)
- Atribute ARIA pentru screen readers
- Butonul de închidere are label accesibil

### 10. Concluzie
`FodModal` este o componentă esențială pentru interacțiuni care necesită atenția focalizată a utilizatorului, oferind flexibilitate maximă pentru diferite cazuri de utilizare, de la simple confirmări până la formulare complexe.