# FodListItem

## Documentație pentru componenta FodListItem

### 1. Descriere Generală

`FodListItem` este componenta pentru elementele individuale dintr-o listă `FodList`. Oferă suport complet pentru text, iconițe, avatare, navigare, liste imbricate și selecție, integr��ndu-se perfect cu componenta părinte FodList.

Caracteristici principale:
- Afișare text cu sau fără iconiță
- Suport pentru avatare
- Navigare prin href
- Liste imbricate expandabile
- Selecție cu evidențiere vizuală
- Ripple effect la click
- Densitate variabilă (normal/dense)
- Suport pentru dezactivare
- Evenimente click personalizabile

### 2. Utilizare de Bază

#### Element simplu de listă
```razor
<FodList>
    <FodListItem>Element simplu</FodListItem>
    <FodListItem>Alt element</FodListItem>
    <FodListItem>Al treilea element</FodListItem>
</FodList>
```

#### Element cu iconiță
```razor
<FodList>
    <FodListItem Icon="@FodIcons.Material.Filled.Home">
        Acasă
    </FodListItem>
    <FodListItem Icon="@FodIcons.Material.Filled.Settings">
        Setări
    </FodListItem>
    <FodListItem Icon="@FodIcons.Material.Filled.Logout">
        Ieșire
    </FodListItem>
</FodList>
```

#### Element cu navigare
```razor
<FodList>
    <FodListItem Href="/dashboard" Icon="@FodIcons.Material.Filled.Dashboard">
        Dashboard
    </FodListItem>
    <FodListItem Href="/reports" Icon="@FodIcons.Material.Filled.Assessment">
        Rapoarte
    </FodListItem>
</FodList>
```

### 3. Atribute și Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Text` | `string` | Textul de afișat | - |
| `Value` | `object` | Valoarea asociată pentru selecție | - |
| `Icon` | `string` | Iconiță de afișat | - |
| `IconColor` | `FodColor` | Culoarea iconiței | `Inherit` |
| `IconSize` | `FodSize` | Dimensiunea iconiței | `Medium` |
| `Avatar` | `string` | URL pentru avatar | - |
| `AvatarClass` | `string` | Clase CSS pentru avatar | - |
| `Href` | `string` | URL pentru navigare | - |
| `ForceLoad` | `bool` | Forțează reîncărcarea paginii | `false` |
| `Disabled` | `bool` | Dezactivează elementul | `false` |
| `DisableRipple` | `bool` | Dezactivează ripple effect | `false` |
| `Dense` | `bool?` | Folosește padding compact | - |
| `DisableGutters` | `bool` | Elimină padding lateral | `false` |
| `Inset` | `bool` | Indentare pentru subheader | `false` |
| `Expanded` | `bool` | Stare expandare pentru liste imbricate | `false` |
| `InitiallyExpanded` | `bool` | Expandat inițial | `false` |
| `ExpandLessIcon` | `string` | Iconiță pentru collapse | `ExpandLess` |
| `ExpandMoreIcon` | `string` | Iconiță pentru expand | `ExpandMore` |
| `AdornmentColor` | `FodColor` | Culoare iconiță expand/collapse | `Default` |
| `OnClick` | `EventCallback<MouseEventArgs>` | Eveniment click | - |
| `ChildContent` | `RenderFragment` | Conținut personalizat | - |
| `NestedList` | `RenderFragment` | Listă imbricată | - |

### 4. Exemple de Utilizare

#### Meniu de navigare
```razor
<FodList Clickable="true">
    <FodListItem Icon="@FodIcons.Material.Filled.Home" 
                 Href="/"
                 Value="home">
        Acasă
    </FodListItem>
    <FodListItem Icon="@FodIcons.Material.Filled.Person" 
                 Href="/profile"
                 Value="profile">
        Profil
    </FodListItem>
    <FodListItem Icon="@FodIcons.Material.Filled.Settings" 
                 Href="/settings"
                 Value="settings">
        Setări
    </FodListItem>
    <FodDivider />
    <FodListItem Icon="@FodIcons.Material.Filled.Logout" 
                 OnClick="Logout"
                 IconColor="FodColor.Error">
        Deconectare
    </FodListItem>
</FodList>

@code {
    private async Task Logout(MouseEventArgs e)
    {
        await AuthService.LogoutAsync();
        NavigationManager.NavigateTo("/login");
    }
}
```

#### Listă cu selecție
```razor
<FodList Clickable="true" @bind-SelectedValue="selectedCategory">
    @foreach (var category in categories)
    {
        <FodListItem Value="@category.Id" 
                     Icon="@category.Icon">
            @category.Name
            <FodChip Size="FodSize.Small" 
                     Color="FodColor.Primary" 
                     Class="ms-auto">
                @category.Count
            </FodChip>
        </FodListItem>
    }
</FodList>

@code {
    private object selectedCategory;
    private List<Category> categories = new()
    {
        new() { Id = 1, Name = "Inbox", Icon = FodIcons.Material.Filled.Inbox, Count = 5 },
        new() { Id = 2, Name = "Trimise", Icon = FodIcons.Material.Filled.Send, Count = 0 },
        new() { Id = 3, Name = "Ciorne", Icon = FodIcons.Material.Filled.Drafts, Count = 2 }
    };
}
```

#### Liste imbricate
```razor
<FodList>
    <FodListItem Icon="@FodIcons.Material.Filled.Person">
        Utilizatori
        <NestedList>
            <FodListItem Href="/users/active">Activi</FodListItem>
            <FodListItem Href="/users/inactive">Inactivi</FodListItem>
            <FodListItem Href="/users/pending">În așteptare</FodListItem>
        </NestedList>
    </FodListItem>
    
    <FodListItem Icon="@FodIcons.Material.Filled.Settings" InitiallyExpanded="true">
        Configurări
        <NestedList>
            <FodListItem Href="/settings/general">Generale</FodListItem>
            <FodListItem Href="/settings/security">Securitate</FodListItem>
            <FodListItem Href="/settings/notifications">Notificări</FodListItem>
        </NestedList>
    </FodListItem>
</FodList>
```

#### Listă densă cu avatare
```razor
<FodList Dense="true">
    @foreach (var user in recentUsers)
    {
        <FodListItem Avatar="@user.AvatarUrl" 
                     OnClick="@(() => SelectUser(user))">
            <div>
                <FodText Typo="Typo.body2">@user.Name</FodText>
                <FodText Typo="Typo.caption" Color="FodColor.Secondary">
                    @user.LastSeen
                </FodText>
            </div>
        </FodListItem>
    }
</FodList>

@code {
    private List<User> recentUsers = new();
    
    private void SelectUser(User user)
    {
        // Deschide chat cu utilizatorul
    }
}
```

#### Listă cu acțiuni
```razor
<FodList>
    @foreach (var item in todoItems)
    {
        <FodListItem>
            <FodCheckbox @bind-Checked="item.IsCompleted" 
                         Class="me-3" />
            <FodText Class="@(item.IsCompleted ? "text-decoration-line-through" : "")">
                @item.Title
            </FodText>
            <FodIconButton Icon="@FodIcons.Material.Filled.Delete" 
                           Size="FodSize.Small"
                           Color="FodColor.Error"
                           OnClick="@(() => DeleteItem(item))"
                           Class="ms-auto" />
        </FodListItem>
    }
</FodList>
```

#### Listă cu stări diferite
```razor
<FodList>
    <FodListItem Icon="@FodIcons.Material.Filled.CheckCircle" 
                 IconColor="FodColor.Success">
        Task completat
    </FodListItem>
    
    <FodListItem Icon="@FodIcons.Material.Filled.Warning" 
                 IconColor="FodColor.Warning">
        Task cu avertismente
    </FodListItem>
    
    <FodListItem Icon="@FodIcons.Material.Filled.Error" 
                 IconColor="FodColor.Error">
        Task cu erori
    </FodListItem>
    
    <FodListItem Icon="@FodIcons.Material.Filled.Block" 
                 Disabled="true">
        Task blocat
    </FodListItem>
</FodList>
```

#### Listă fără gutters
```razor
<FodList DisablePadding="true">
    <FodListItem DisableGutters="true" 
                 Class="px-4 py-3 border-bottom">
        Element full-width 1
    </FodListItem>
    <FodListItem DisableGutters="true" 
                 Class="px-4 py-3 border-bottom">
        Element full-width 2
    </FodListItem>
</FodList>
```

### 5. Liste Complexe

#### Listă cu header și subheader
```razor
<FodList>
    <FodListSubheader>Conversații recente</FodListSubheader>
    
    <FodListItem Avatar="/avatars/user1.jpg">
        <div>
            <FodText Typo="Typo.subtitle2">Maria Popescu</FodText>
            <FodText Typo="Typo.body2" Color="FodColor.Secondary">
                Am primit documentele, mulțumesc!
            </FodText>
        </div>
        <FodText Typo="Typo.caption" Class="ms-auto">
            10:45
        </FodText>
    </FodListItem>
    
    <FodDivider />
    
    <FodListSubheader>Conversații anterioare</FodListSubheader>
    <!-- Mai multe elemente -->
</FodList>
```

#### Listă tip file explorer
```razor
<FodList>
    <FodListItem Icon="@FodIcons.Material.Filled.Folder" 
                 IconColor="FodColor.Warning">
        Documente
        <NestedList>
            <FodListItem Icon="@FodIcons.Material.Filled.Folder" 
                         IconColor="FodColor.Warning">
                2024
                <NestedList>
                    <FodListItem Icon="@FodIcons.Custom.FileFormats.FileWord">
                        Raport.docx
                    </FodListItem>
                    <FodListItem Icon="@FodIcons.Custom.FileFormats.FileExcel">
                        Buget.xlsx
                    </FodListItem>
                </NestedList>
            </FodListItem>
            <FodListItem Icon="@FodIcons.Material.Filled.Folder" 
                         IconColor="FodColor.Warning">
                2023
            </FodListItem>
        </NestedList>
    </FodListItem>
</FodList>
```

### 6. Stilizare

```css
/* Hover personalizat */
.custom-list .fod-list-item:hover {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.08);
}

/* Selecție personalizată */
.custom-list .fod-selected-item {
    background-color: rgba(var(--fod-palette-primary-rgb), 0.12);
    border-left: 4px solid var(--fod-palette-primary-main);
}

/* Animație pentru iconițe */
.animated-list .fod-list-item-icon {
    transition: transform 0.2s ease;
}

.animated-list .fod-list-item:hover .fod-list-item-icon {
    transform: translateX(4px);
}

/* Liste cu margini rotunjite */
.rounded-list .fod-list-item:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.rounded-list .fod-list-item:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}
```

### 7. Integrare cu alte componente

#### În Drawer
```razor
<FodDrawer @bind-Open="drawerOpen">
    <FodList>
        <FodListItem Icon="@FodIcons.Material.Filled.Dashboard" 
                     Href="/dashboard">
            Dashboard
        </FodListItem>
        <!-- Mai multe elemente -->
    </FodList>
</FodDrawer>
```

#### În Card
```razor
<FodCard>
    <FodCardContent Class="pa-0">
        <FodList>
            <FodListItem>Opțiune 1</FodListItem>
            <FodListItem>Opțiune 2</FodListItem>
        </FodList>
    </FodCardContent>
</FodCard>
```

### 8. Best Practices

1. **Iconițe consistente** - Folosiți același stil de iconițe în listă
2. **Feedback vizual** - Oferiți feedback clar pentru starea selectată
3. **Densitate adecvată** - Folosiți dense pentru liste lungi
4. **Grupare logică** - Organizați elementele în categorii clare
5. **Accesibilitate** - Includeți aria-labels pentru screen readers
6. **Loading states** - Afișați skeleton loaders pentru liste dinamice

### 9. Performanță

- Pentru liste mari, folosiți virtualizare cu `FodVirtualize`
- Evitați re-render prin folosirea `@key` în bucle
- Pentru liste imbricate complexe, încărcați lazy conținutul

### 10. Accesibilitate

- Elementele primesc focus automat cu tabindex="0"
- Suport complet pentru navigare cu tastatura
- ARIA roles sunt aplicate automat
- Folosiți text descriptiv pentru screen readers

### 11. Troubleshooting

#### Click nu funcționează
- Verificați că lista părinte are `Clickable="true"`
- Verificați că elementul nu este `Disabled`
- Verificați `OnClickHandlerPreventDefault`

#### Selecția nu funcționează
- Verificați că ați setat `Value` pe fiecare element
- Verificați binding-ul pe lista părinte

#### Iconițele nu apar
- Verificați că fonturile icon sunt încărcate
- Verificați namespace-ul iconiței

### 12. Concluzie

`FodListItem` oferă flexibilitate maximă pentru crearea de liste interactive în aplicațiile FOD. Cu suport pentru iconițe, navigare, selecție și liste imbricate, componenta acoperă toate scenariile comune de UI pentru liste.