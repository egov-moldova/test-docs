# List

## Documentație pentru componentele FodList și FodListItem

### 1. Descriere Generală
`FodList` și `FodListItem` formează un sistem complet pentru afișarea și gestionarea listelor în aplicații Blazor. Componentele oferă suport pentru liste simple, liste interactive cu selecție, liste imbricate și integrare cu navigarea.

Caracteristici principale:
- Liste simple și interactive
- Selecție single cu urmărire valoare
- Liste imbricate cu expand/collapse
- Integrare cu pictograme și avatare
- Densitate ajustabilă (normal/compact)
- Suport pentru navigare
- Stilizare flexibilă
- Accesibilitate completă

### 2. Ghid de Utilizare API

#### Listă simplă
```razor
<FodList>
    <FodListItem Text="Element 1" />
    <FodListItem Text="Element 2" />
    <FodListItem Text="Element 3" />
</FodList>
```

#### Listă cu selecție
```razor
<FodList Clickable="true" @bind-SelectedValue="selectedOption">
    <FodListItem Text="Opțiunea 1" Value="1" />
    <FodListItem Text="Opțiunea 2" Value="2" />
    <FodListItem Text="Opțiunea 3" Value="3" />
</FodList>

@code {
    private object selectedOption = "1";
}
```

#### Listă cu pictograme
```razor
<FodList>
    <FodListItem Text="Documente" 
                 Icon="@FodIcons.Material.Filled.Folder"
                 IconColor="FodColor.Primary" />
    <FodListItem Text="Imagini" 
                 Icon="@FodIcons.Material.Filled.Image"
                 IconColor="FodColor.Success" />
    <FodListItem Text="Video" 
                 Icon="@FodIcons.Material.Filled.VideoLibrary"
                 IconColor="FodColor.Secondary" />
    <FodListItem Text="Audio" 
                 Icon="@FodIcons.Material.Filled.AudioFile"
                 IconColor="FodColor.Warning" />
</FodList>
```

#### Listă cu conținut personalizat
```razor
<FodList Clickable="true">
    <FodListItem>
        <div class="d-flex align-items-center">
            <FodIcon Icon="@FodIcons.Material.Filled.Person" 
                     Size="FodSize.Large" 
                     Class="me-3" />
            <div>
                <FodText Typo="Typo.subtitle1">Ion Popescu</FodText>
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    ion.popescu@example.md
                </FodText>
            </div>
        </div>
    </FodListItem>
    <FodListItem>
        <div class="d-flex align-items-center">
            <FodIcon Icon="@FodIcons.Material.Filled.Person" 
                     Size="FodSize.Large" 
                     Class="me-3" />
            <div>
                <FodText Typo="Typo.subtitle1">Maria Ionescu</FodText>
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    maria.ionescu@example.md
                </FodText>
            </div>
        </div>
    </FodListItem>
</FodList>
```

#### Listă imbricată (nested)
```razor
<FodList Clickable="true">
    <FodListItem Text="Inbox" 
                 Icon="@FodIcons.Material.Filled.Inbox">
        <NestedList>
            <FodListItem Text="Primite" Value="received" />
            <FodListItem Text="Importante" Value="important" />
            <FodListItem Text="Necitite" Value="unread" />
        </NestedList>
    </FodListItem>
    
    <FodListItem Text="Trimise" 
                 Icon="@FodIcons.Material.Filled.Send" 
                 Value="sent" />
    
    <FodListItem Text="Ciorne" 
                 Icon="@FodIcons.Material.Filled.Drafts" 
                 Value="drafts" />
    
    <FodListItem Text="Arhivă" 
                 Icon="@FodIcons.Material.Filled.Archive">
        <NestedList>
            <FodListItem Text="2024" Value="archive-2024" />
            <FodListItem Text="2023" Value="archive-2023" />
            <FodListItem Text="2022" Value="archive-2022" />
        </NestedList>
    </FodListItem>
</FodList>
```

#### Listă cu navigare
```razor
<FodList>
    <FodListItem Text="Acasă" 
                 Icon="@FodIcons.Material.Filled.Home"
                 Href="/" />
    <FodListItem Text="Produse" 
                 Icon="@FodIcons.Material.Filled.ShoppingCart"
                 Href="/products" />
    <FodListItem Text="Despre noi" 
                 Icon="@FodIcons.Material.Filled.Info"
                 Href="/about" />
    <FodListItem Text="Contact" 
                 Icon="@FodIcons.Material.Filled.ContactMail"
                 Href="/contact" />
</FodList>
```

#### Listă densă (compact)
```razor
<FodList Dense="true" DisablePadding="true">
    <FodListItem Text="Element compact 1" />
    <FodListItem Text="Element compact 2" />
    <FodListItem Text="Element compact 3" />
    <FodListItem Text="Element compact 4" />
    <FodListItem Text="Element compact 5" />
</FodList>
```

#### Listă cu control expansiune
```razor
<FodList>
    <FodListItem Text="Setări generale" 
                 Icon="@FodIcons.Material.Filled.Settings"
                 @bind-Expanded="generalExpanded"
                 InitiallyExpanded="true">
        <NestedList>
            <FodListItem Text="Profil" />
            <FodListItem Text="Notificări" />
            <FodListItem Text="Limbă" />
        </NestedList>
    </FodListItem>
    
    <FodListItem Text="Securitate" 
                 Icon="@FodIcons.Material.Filled.Security"
                 @bind-Expanded="securityExpanded">
        <NestedList>
            <FodListItem Text="Parolă" />
            <FodListItem Text="Autentificare în doi pași" />
            <FodListItem Text="Sesiuni active" />
        </NestedList>
    </FodListItem>
</FodList>

@code {
    private bool generalExpanded = true;
    private bool securityExpanded = false;
}
```

#### Listă pentru meniu lateral
```razor
<FodList Clickable="true" @bind-SelectedValue="currentPage">
    <FodListItem Text="Dashboard" 
                 Icon="@FodIcons.Material.Filled.Dashboard"
                 IconColor="FodColor.Primary"
                 Value="dashboard" />
    
    <FodListItem Text="Analize" 
                 Icon="@FodIcons.Material.Filled.Analytics"
                 IconColor="FodColor.Success"
                 Value="analytics" />
    
    <FodListItem Text="Rapoarte" 
                 Icon="@FodIcons.Material.Filled.Assessment"
                 IconColor="FodColor.Warning">
        <NestedList>
            <FodListItem Text="Vânzări" Value="reports-sales" />
            <FodListItem Text="Inventar" Value="reports-inventory" />
            <FodListItem Text="Financiar" Value="reports-financial" />
        </NestedList>
    </FodListItem>
    
    <FodListItem Text="Utilizatori" 
                 Icon="@FodIcons.Material.Filled.People"
                 IconColor="FodColor.Info"
                 Value="users" />
    
    <FodListItem Text="Setări" 
                 Icon="@FodIcons.Material.Filled.Settings"
                 IconColor="FodColor.Secondary"
                 Value="settings" />
</FodList>

@code {
    private object currentPage = "dashboard";
}
```

#### Listă cu elemente dezactivate
```razor
<FodList Clickable="true">
    <FodListItem Text="Activ" Value="1" />
    <FodListItem Text="Activ" Value="2" />
    <FodListItem Text="Dezactivat" Value="3" Disabled="true" />
    <FodListItem Text="Activ" Value="4" />
    <FodListItem Text="Dezactivat global" Value="5" />
</FodList>

<!-- Sau dezactivare globală -->
<FodList Clickable="true" Disabled="true">
    <FodListItem Text="Toate elementele sunt dezactivate" />
</FodList>
```

#### Listă pentru inbox email
```razor
<FodList Clickable="true" @bind-SelectedValue="selectedEmail">
    @foreach (var email in emails)
    {
        <FodListItem Value="@email.Id">
            <div class="d-flex justify-space-between align-start">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                        <FodText Typo="Typo.subtitle2" Class="me-2">
                            @email.From
                        </FodText>
                        @if (!email.IsRead)
                        {
                            <FodChip Size="FodSize.Small" Color="FodColor.Primary">
                                Nou
                            </FodChip>
                        }
                    </div>
                    <FodText Typo="Typo.body2">@email.Subject</FodText>
                    <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                        @email.Preview
                    </FodText>
                </div>
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    @email.Date.ToString("HH:mm")
                </FodText>
            </div>
        </FodListItem>
    }
</FodList>
```

#### Listă cu acțiuni
```razor
<FodList>
    <FodListItem>
        <div class="d-flex justify-space-between align-items-center">
            <div class="d-flex align-items-center">
                <FodIcon Icon="@FodIcons.Material.Filled.AttachFile" 
                         Class="me-3" />
                <div>
                    <FodText>Document.pdf</FodText>
                    <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                        2.5 MB
                    </FodText>
                </div>
            </div>
            <div>
                <FodIconButton Icon="@FodIcons.Material.Filled.Download" 
                               Size="FodSize.Small" 
                               Title="Descarcă" />
                <FodIconButton Icon="@FodIcons.Material.Filled.Delete" 
                               Size="FodSize.Small" 
                               Color="FodColor.Error"
                               Title="Șterge" />
            </div>
        </div>
    </FodListItem>
</FodList>
```

### 3. Atribute disponibile

#### FodList
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Clickable` | `bool` | Activează selecția și click | `false` |
| `Color` | `FodColor` | Culoarea elementelor selectate | `Primary` |
| `Dense` | `bool` | Mod compact pentru toate elementele | `false` |
| `DisablePadding` | `bool` | Elimină padding vertical | `false` |
| `DisableGutters` | `bool` | Elimină padding orizontal | `false` |
| `Disabled` | `bool` | Dezactivează toate elementele | `false` |
| `SelectedItem` | `FodListItem` | Elementul selectat curent | `null` |
| `SelectedValue` | `object` | Valoarea selectată curent | `null` |
| `SelectedItemChanged` | `EventCallback<FodListItem>` | Eveniment la schimbare selecție | - |
| `SelectedValueChanged` | `EventCallback<object>` | Eveniment la schimbare valoare | - |
| `ChildContent` | `RenderFragment` | Conținutul listei | - |

#### FodListItem
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul elementului | `null` |
| `Value` | `object` | Valoarea pentru selecție | `null` |
| `Icon` | `string` | Pictograma de afișat | `null` |
| `IconColor` | `FodColor` | Culoarea pictogramei | `Default` |
| `IconSize` | `FodSize` | Dimensiunea pictogramei | `Medium` |
| `Avatar` | `string` | URL avatar (neimplementat) | `null` |
| `Href` | `string` | URL pentru navigare | `null` |
| `ForceLoad` | `bool` | Forțează reîncărcare browser | `false` |
| `Disabled` | `bool` | Dezactivează elementul | `false` |
| `DisableRipple` | `bool` | Dezactivează efectul ripple | `false` |
| `Dense` | `bool?` | Mod compact pentru element | `null` |
| `Inset` | `bool` | Indentează textul | `false` |
| `DisableGutters` | `bool` | Elimină padding orizontal | `false` |
| `NestedList` | `RenderFragment` | Listă imbricată | `null` |
| `Expanded` | `bool` | Stare expansiune | `false` |
| `InitiallyExpanded` | `bool` | Expandat inițial | `false` |
| `ExpandLessIcon` | `string` | Pictogramă collapse | `ExpandLess` |
| `ExpandMoreIcon` | `string` | Pictogramă expand | `ExpandMore` |
| `ChildContent` | `RenderFragment` | Conținut personalizat | `null` |

### 4. Evenimente

| Eveniment | Descriere |
|-----------|-----------|
| `SelectedItemChanged` | Se declanșează când se schimbă elementul selectat |
| `SelectedValueChanged` | Se declanșează când se schimbă valoarea selectată |
| `ExpandedChanged` | Se declanșează când se schimbă starea de expansiune |
| `OnClick` | Se declanșează la click pe element (intern) |

### 5. Stilizare și personalizare

```css
/* Listă personalizată */
.custom-list {
    background-color: #f5f5f5;
    border-radius: 8px;
}

.custom-list .fod-list-item {
    border-bottom: 1px solid #e0e0e0;
}

.custom-list .fod-list-item:last-child {
    border-bottom: none;
}

/* Hover effect personalizat */
.custom-list .fod-list-item-clickable:hover {
    background-color: rgba(0, 0, 0, 0.08);
}

/* Element selectat personalizat */
.custom-list .fod-selected {
    background-color: rgba(25, 118, 210, 0.12);
    border-left: 4px solid #1976d2;
}

/* Listă densă cu spațiere minimă */
.ultra-dense-list .fod-list-item {
    min-height: 32px;
    padding-top: 2px;
    padding-bottom: 2px;
}
```

### 6. Integrare cu alte componente

#### În drawer pentru navigare
```razor
<FodDrawer>
    <FodList Clickable="true">
        <FodListItem Text="Dashboard" 
                     Icon="@FodIcons.Material.Filled.Dashboard"
                     Href="/dashboard" />
        <FodListItem Text="Rapoarte" 
                     Icon="@FodIcons.Material.Filled.Assessment"
                     Href="/reports" />
    </FodList>
</FodDrawer>
```

#### În card pentru opțiuni
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Setări notificări
        </FodText>
        <FodList>
            <FodListItem>
                <div class="d-flex justify-space-between align-items-center">
                    <FodText>Notificări email</FodText>
                    <FodSwitch @bind-Checked="emailNotifications" />
                </div>
            </FodListItem>
            <FodListItem>
                <div class="d-flex justify-space-between align-items-center">
                    <FodText>Notificări SMS</FodText>
                    <FodSwitch @bind-Checked="smsNotifications" />
                </div>
            </FodListItem>
        </FodList>
    </FodCardContent>
</FodCard>
```

### 7. Patterns comune

#### Listă de selecție
```razor
<FodList Clickable="true" @bind-SelectedValue="selectedItem" Color="FodColor.Secondary">
    @foreach (var item in items)
    {
        <FodListItem Text="@item.Name" Value="@item.Id" />
    }
</FodList>
```

#### Meniu cu sub-meniuri
```razor
<FodList>
    @foreach (var menu in menuItems)
    {
        <FodListItem Text="@menu.Title" 
                     Icon="@menu.Icon"
                     Href="@menu.Url">
            @if (menu.Children?.Any() == true)
            {
                <NestedList>
                    @foreach (var child in menu.Children)
                    {
                        <FodListItem Text="@child.Title" 
                                     Href="@child.Url" />
                    }
                </NestedList>
            }
        </FodListItem>
    }
</FodList>
```

### 8. Performanță

- Folosiți `Dense="true"` pentru liste lungi
- Pentru liste foarte mari, considerați virtualizare
- Evitați conținut complex în liste cu multe elemente
- Dezactivați ripple pentru performanță maximă

### 9. Accesibilitate

- Elementele clickable au `role="button"`
- Suport pentru navigare cu tastatura
- Starea de selecție anunțată screen readers
- Expand/collapse accesibil cu taste săgeți

### 10. Note și observații

- Selecția necesită `Clickable="true"` pe FodList
- Elementele cu `Href` devin link-uri navigabile
- `Value` este necesar pentru urmărirea selecției
- Listele imbricate se expandează/colapsează smooth

### 11. Bune practici

1. **Consistență** - Folosiți același stil în toată aplicația
2. **Densitate** - Dense pentru multe elemente, normal pentru puține
3. **Pictograme** - Ajută la scanare rapidă a listei
4. **Grupare** - Folosiți liste imbricate pentru organizare
5. **Feedback** - Selecția vizibilă pentru elemente interactive
6. **Performanță** - Conținut simplu pentru liste mari

### 12. Troubleshooting

#### Selecția nu funcționează
- Verificați că `Clickable="true"` pe FodList
- Verificați că elementele au `Value` setat

#### Expansiunea nu funcționează
- Verificați că aveți NestedList definit
- Verificați binding-ul pentru Expanded

#### Navigarea nu funcționează
- Verificați că Href este URL valid
- Pentru SPA, nu folosiți ForceLoad

### 13. Concluzie
`FodList` și `FodListItem` oferă o soluție completă pentru afișarea și gestionarea listelor în aplicații Blazor. Cu suport pentru selecție, navigare, liste imbricate și personalizare extensivă, acoperă toate scenariile comune de UI pentru liste.