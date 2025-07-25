# Dropdown

## Documentație pentru componentele FodDropdown și Dropdown

### 1. Descriere Generală
`FodDropdown` este o componentă dropdown generică care permite selectarea unei opțiuni dintr-o listă derulantă. Oferă o interfață flexibilă și personalizabilă pentru meniuri dropdown, cu suport pentru tipuri generice și evenimente de selecție.

Componenta include:
- Suport pentru tipuri generice de date
- Detectare automată click în afara dropdown-ului
- Personalizare completă a afișării elementelor
- Integrare cu sistemul de butoane FOD
- Variantă simplificată non-generică (Dropdown)
- Suport pentru pictograme în buton

### 2. Ghid de Utilizare API

#### Dropdown de bază
```razor
<FodDropdown TItem="string" OnSelected="@OnLanguageSelected">
    <InitialTip>Selectați limba</InitialTip>
    <ChildContent>
        <FodDropdownListItem Item="ro">Română</FodDropdownListItem>
        <FodDropdownListItem Item="ru">Русский</FodDropdownListItem>
        <FodDropdownListItem Item="en">English</FodDropdownListItem>
    </ChildContent>
</FodDropdown>

@code {
    private void OnLanguageSelected(string language)
    {
        Console.WriteLine($"Limba selectată: {language}");
    }
}
```

#### Dropdown cu pictogramă
```razor
<FodDropdown TItem="string" 
             StartIcon="@FodIcons.Material.Filled.Language" 
             OnSelected="@OnLanguageSelected"
             Variant="FodVariant.Text">
    <InitialTip>RO</InitialTip>
    <ChildContent>
        <FodDropdownListItem Item="ro">
            <span class="flag-icon flag-icon-md me-2"></span> Română
        </FodDropdownListItem>
        <FodDropdownListItem Item="ru">
            <span class="flag-icon flag-icon-ru me-2"></span> Русский
        </FodDropdownListItem>
        <FodDropdownListItem Item="en">
            <span class="flag-icon flag-icon-gb me-2"></span> English
        </FodDropdownListItem>
    </ChildContent>
</FodDropdown>
```

#### Dropdown cu obiecte complexe
```razor
<FodDropdown TItem="User" OnSelected="@OnUserSelected">
    <InitialTip>Selectați utilizator</InitialTip>
    <ChildContent>
        @foreach (var user in users)
        {
            <FodDropdownListItem Item="@user">
                <div class="d-flex align-items-center">
                    <FodIcon Icon="@FodIcons.Material.Filled.Person" 
                             Size="Size.Small" 
                             Class="me-2" />
                    <div>
                        <div>@user.Name</div>
                        <small class="text-muted">@user.Email</small>
                    </div>
                </div>
            </FodDropdownListItem>
        }
    </ChildContent>
</FodDropdown>

@code {
    private List<User> users = GetUsers();
    
    private void OnUserSelected(User user)
    {
        selectedUser = user;
        StateHasChanged();
    }
}
```

#### Dropdown cu stilizare personalizată
```razor
<FodDropdown TItem="string" 
             OnSelected="@OnActionSelected"
             Variant="FodVariant.Filled"
             Class="custom-dropdown"
             Style="min-width: 200px;">
    <InitialTip>
        <FodIcon Icon="@FodIcons.Material.Filled.Settings" Class="me-2" />
        Acțiuni
    </InitialTip>
    <ChildContent>
        <FodDropdownListItem Item="edit">
            <FodIcon Icon="@FodIcons.Material.Filled.Edit" Class="me-2" /> Editează
        </FodDropdownListItem>
        <FodDropdownListItem Item="duplicate">
            <FodIcon Icon="@FodIcons.Material.Filled.FileCopy" Class="me-2" /> Duplică
        </FodDropdownListItem>
        <FodDropdownListItem Item="delete">
            <FodIcon Icon="@FodIcons.Material.Filled.Delete" Class="me-2 text-danger" /> 
            <span class="text-danger">Șterge</span>
        </FodDropdownListItem>
    </ChildContent>
</FodDropdown>

<style>
    .custom-dropdown .dropdown-menu {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }
    
    .custom-dropdown .dropdown-item:hover {
        background-color: #f5f5f5;
    }
</style>
```

#### Dropdown simplu (non-generic)
```razor
<Dropdown StartIcon="@FodIcons.Material.Filled.MoreVert"
          Title="Mai multe"
          Variant="FodVariant.Text"
          DropDownMenuClass="dropdown-menu-end">
    <a class="dropdown-item" href="#" @onclick="Edit">Editează</a>
    <a class="dropdown-item" href="#" @onclick="Duplicate">Duplică</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item text-danger" href="#" @onclick="Delete">Șterge</a>
</Dropdown>
```

#### Dropdown pentru meniu utilizator
```razor
<FodDropdown TItem="string" OnSelected="@OnMenuSelected" Variant="FodVariant.Text">
    <InitialTip>
        <FodIcon Icon="@FodIcons.Material.Filled.AccountCircle" 
                 Size="Size.Small" 
                 Class="me-2" />
        <span>@currentUser.Name</span>
    </InitialTip>
    <ChildContent>
        <FodDropdownListItem Item="profile">
            <FodIcon Icon="@FodIcons.Material.Filled.Person" Class="me-2" /> Profil
        </FodDropdownListItem>
        <FodDropdownListItem Item="settings">
            <FodIcon Icon="@FodIcons.Material.Filled.Settings" Class="me-2" /> Setări
        </FodDropdownListItem>
        <div class="dropdown-divider"></div>
        <FodDropdownListItem Item="logout">
            <FodIcon Icon="@FodIcons.Material.Filled.Logout" Class="me-2" /> Deconectare
        </FodDropdownListItem>
    </ChildContent>
</FodDropdown>

@code {
    private async Task OnMenuSelected(string action)
    {
        switch (action)
        {
            case "profile":
                Navigation.NavigateTo("/profile");
                break;
            case "settings":
                Navigation.NavigateTo("/settings");
                break;
            case "logout":
                await AuthService.Logout();
                break;
        }
    }
}
```

#### Dropdown cu grupare vizuală
```razor
<FodDropdown TItem="MenuItem" OnSelected="@OnMenuItemSelected">
    <InitialTip>Selectați o opțiune</InitialTip>
    <ChildContent>
        <h6 class="dropdown-header">Documente</h6>
        <FodDropdownListItem Item="@menuItems[0]">
            <FodIcon Icon="@menuItems[0].Icon" Class="me-2" /> @menuItems[0].Title
        </FodDropdownListItem>
        <FodDropdownListItem Item="@menuItems[1]">
            <FodIcon Icon="@menuItems[1].Icon" Class="me-2" /> @menuItems[1].Title
        </FodDropdownListItem>
        
        <div class="dropdown-divider"></div>
        <h6 class="dropdown-header">Rapoarte</h6>
        <FodDropdownListItem Item="@menuItems[2]">
            <FodIcon Icon="@menuItems[2].Icon" Class="me-2" /> @menuItems[2].Title
        </FodDropdownListItem>
        <FodDropdownListItem Item="@menuItems[3]">
            <FodIcon Icon="@menuItems[3].Icon" Class="me-2" /> @menuItems[3].Title
        </FodDropdownListItem>
    </ChildContent>
</FodDropdown>
```

#### Dropdown cu stări
```razor
<FodDropdown TItem="string" 
             OnSelected="@OnStatusSelected"
             Variant="@GetVariantForStatus(currentStatus)">
    <InitialTip>
        <FodIcon Icon="@GetIconForStatus(currentStatus)" Class="me-2" />
        @GetLabelForStatus(currentStatus)
    </InitialTip>
    <ChildContent>
        <FodDropdownListItem Item="active">
            <FodIcon Icon="@FodIcons.Material.Filled.CheckCircle" Class="me-2 text-success" />
            <span class="text-success">Activ</span>
        </FodDropdownListItem>
        <FodDropdownListItem Item="inactive">
            <FodIcon Icon="@FodIcons.Material.Filled.Cancel" Class="me-2 text-danger" />
            <span class="text-danger">Inactiv</span>
        </FodDropdownListItem>
        <FodDropdownListItem Item="pending">
            <FodIcon Icon="@FodIcons.Material.Filled.Schedule" Class="me-2 text-warning" />
            <span class="text-warning">În așteptare</span>
        </FodDropdownListItem>
    </ChildContent>
</FodDropdown>

@code {
    private string currentStatus = "active";
    
    private void OnStatusSelected(string status)
    {
        currentStatus = status;
        StateHasChanged();
    }
    
    private FodVariant GetVariantForStatus(string status) => status switch
    {
        "active" => FodVariant.Filled,
        "inactive" => FodVariant.Outlined,
        _ => FodVariant.Text
    };
}
```

### 3. Atribute disponibile

#### FodDropdown<TItem>
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `TItem` | `Type` | Tipul generic al elementelor din dropdown | - |
| `StartIcon` | `string` | Pictograma afișată în buton | `null` |
| `Variant` | `FodVariant` | Stilul butonului (Text, Filled, Outlined) | `Text` |
| `InitialTip` | `RenderFragment` | Textul inițial afișat în buton | - |
| `ChildContent` | `RenderFragment` | Conținutul dropdown-ului | - |
| `OnSelected` | `EventCallback<TItem>` | Eveniment declanșat la selecție | - |
| `Class` | `string` | Clase CSS adiționale | `null` |
| `Style` | `string` | Stiluri inline adiționale | `null` |

#### Dropdown (simplu)
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `StartIcon` | `string` | Pictograma butonului | `null` |
| `Title` | `string` | Textul butonului | `""` |
| `Variant` | `FodVariant` | Stilul butonului | `Text` |
| `DropDownMenuClass` | `string` | Clase CSS pentru meniul dropdown | `""` |
| `Class` | `string` | Clase CSS pentru buton | `""` |
| `Style` | `string` | Stiluri inline | `""` |

#### FodDropdownListItem<TItem>
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Item` | `TItem` | Elementul de date asociat | - |
| `ChildContent` | `RenderFragment<TItem>` | Template pentru afișare | - |

### 4. Evenimente

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| `OnSelected` | `EventCallback<TItem>` | Se declanșează când un element este selectat |

### 5. Metode publice

#### FodDropdown
| Metodă | Descriere |
|--------|-----------|
| `Hide()` | Închide dropdown-ul programatic |

### 6. Componente asociate

- **OutsideHandleContainer** - Detectează click-uri în afara dropdown-ului
- **FodButton** - Folosit ca trigger pentru dropdown
- **FodIcon** - Pentru afișarea pictogramelor

### 7. Stilizare și personalizare

```css
/* Stiluri personalizate pentru dropdown */
.custom-dropdown .dropdown-toggle {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 16px;
}

.custom-dropdown .dropdown-menu {
    border: 1px solid #e0e0e0;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    border-radius: 8px;
    padding: 8px 0;
}

.custom-dropdown .dropdown-item {
    padding: 12px 20px;
    transition: all 0.2s ease;
}

.custom-dropdown .dropdown-item:hover {
    background-color: #f5f5f5;
    transform: translateX(4px);
}

/* Dropdown cu animații */
.animated-dropdown .dropdown-menu {
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### 8. Diferențe între FodDropdown și Dropdown

| Caracteristică | FodDropdown | Dropdown |
|---------------|-------------|----------|
| Suport tipuri generice | Da | Nu |
| Evenimente de selecție | Da | Nu |
| Actualizare automată text | Da | Nu |
| Complexitate | Medie | Simplă |
| Cazuri de utilizare | Selecții complexe | Meniuri simple |

### 9. Integrare cu formulare

```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <div class="mb-3">
        <label>Departament</label>
        <FodDropdown TItem="Department" OnSelected="@(dept => model.Department = dept)">
            <InitialTip>
                @(model.Department?.Name ?? "Selectați departament")
            </InitialTip>
            <ChildContent>
                @foreach (var dept in departments)
                {
                    <FodDropdownListItem Item="@dept">
                        @dept.Name
                    </FodDropdownListItem>
                }
            </ChildContent>
        </FodDropdown>
        <ValidationMessage For="@(() => model.Department)" />
    </div>
</EditForm>
```

### 10. Note și observații

- Dropdown-ul se închide automat la click în afară
- Pentru liste lungi, considerați folosirea FodSelect cu căutare
- Suportă orice tip de conținut în elementele dropdown
- Click pe un element închide automat dropdown-ul
- Pentru meniuri persistente, folosiți componenta Dropdown simplă

### 11. Accesibilitate

- Generare automată ID-uri pentru WCAG
- Suport navigare cu tastatura
- Atribute ARIA pentru screen readers
- Focus management integrat

### 12. Bune practici

1. **Tipuri generice** - Folosiți tipuri specifice pentru type safety
2. **Pictograme descriptive** - Ajută la identificarea rapidă
3. **Feedback vizual** - Evidențiați elementul selectat
4. **Grupare logică** - Folosiți separatoare și headere
5. **Acțiuni clare** - Etichetați clar fiecare opțiune
6. **Responsive** - Testați pe diferite dimensiuni de ecran

### 13. Troubleshooting

#### Dropdown-ul nu se închide
- Verificați că `OutsideHandleContainer` funcționează
- Verificați consolă pentru erori JavaScript

#### Evenimentul OnSelected nu se declanșează
- Verificați că ați specificat `Item` pentru `FodDropdownListItem`
- Verificați că tipul generic este corect

### 14. Concluzie
`FodDropdown` oferă o soluție flexibilă și puternică pentru implementarea de meniuri dropdown, cu suport pentru tipuri generice și personalizare completă. Pentru cazuri simple, componenta `Dropdown` oferă o alternativă mai ușoară.