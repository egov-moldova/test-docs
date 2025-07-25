# OutsideHandleContainer

## Descriere Generală

Componenta `OutsideHandleContainer` detectează click-urile în afara elementului său și declanșează o acțiune specificată. Este utilă pentru închiderea meniurilor dropdown, modalelor, sau a altor elemente UI care trebuie să se închidă când utilizatorul face click în altă parte a paginii.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<OutsideHandleContainer OnClickOutside="@CloseDropdown">
    <div class="dropdown @(isOpen ? "show" : "")">
        <button @onclick="ToggleDropdown">Meniu</button>
        @if (isOpen)
        {
            <div class="dropdown-menu">
                <a href="#">Opțiune 1</a>
                <a href="#">Opțiune 2</a>
                <a href="#">Opțiune 3</a>
            </div>
        }
    </div>
</OutsideHandleContainer>

@code {
    private bool isOpen = false;

    private void ToggleDropdown()
    {
        isOpen = !isOpen;
    }

    private void CloseDropdown()
    {
        isOpen = false;
        StateHasChanged();
    }
}
```

### Pentru custom dropdown

```razor
<OutsideHandleContainer OnClickOutside="@(() => showOptions = false)">
    <div class="custom-select">
        <input @onclick="@(() => showOptions = true)" 
               value="@selectedValue" 
               readonly />
        
        @if (showOptions)
        {
            <div class="options-list">
                @foreach (var option in options)
                {
                    <div @onclick="@(() => SelectOption(option))">
                        @option
                    </div>
                }
            </div>
        }
    </div>
</OutsideHandleContainer>

@code {
    private bool showOptions = false;
    private string selectedValue = "";
    private List<string> options = new() { "Opțiune A", "Opțiune B", "Opțiune C" };

    private void SelectOption(string option)
    {
        selectedValue = option;
        showOptions = false;
    }
}
```

### Pentru tooltip sau popover

```razor
<OutsideHandleContainer OnClickOutside="@HideTooltip">
    <div class="tooltip-container">
        <button @onclick="ShowTooltip">
            <FodIcon Icon="@FodIcons.Outlined.Info" />
        </button>
        
        @if (tooltipVisible)
        {
            <div class="tooltip-content">
                <h5>Informație</h5>
                <p>Acesta este un tooltip care se închide la click exterior.</p>
            </div>
        }
    </div>
</OutsideHandleContainer>

@code {
    private bool tooltipVisible = false;

    private void ShowTooltip()
    {
        tooltipVisible = true;
    }

    private void HideTooltip()
    {
        tooltipVisible = false;
        StateHasChanged();
    }
}
```

### Pentru meniu contextual

```razor
<OutsideHandleContainer OnClickOutside="@CloseContextMenu">
    <div @oncontextmenu="@ShowContextMenu" @oncontextmenu:preventDefault="true">
        Click dreapta pentru meniu
        
        @if (contextMenuVisible)
        {
            <div class="context-menu" style="@GetMenuPosition()">
                <div @onclick="@Cut">Taie</div>
                <div @onclick="@Copy">Copiază</div>
                <div @onclick="@Paste">Lipește</div>
            </div>
        }
    </div>
</OutsideHandleContainer>

@code {
    private bool contextMenuVisible = false;
    private double menuX, menuY;

    private void ShowContextMenu(MouseEventArgs e)
    {
        menuX = e.ClientX;
        menuY = e.ClientY;
        contextMenuVisible = true;
    }

    private void CloseContextMenu()
    {
        contextMenuVisible = false;
        StateHasChanged();
    }

    private string GetMenuPosition()
    {
        return $"left: {menuX}px; top: {menuY}px;";
    }
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| OnClickOutside | Action | null | Acțiunea executată la click în afara containerului |
| ChildContent | RenderFragment | - | Conținutul care va fi monitorizat |

## Evenimente

Componenta nu expune evenimente publice, dar folosește `OnClickOutside` ca un callback.

## Metode publice

| Metodă | Descriere |
|--------|-----------|
| InvokeClickOutside() | Metodă marcată [JSInvokable] apelată de JavaScript |

## Componente asociate

Poate fi folosită cu orice componentă FOD care necesită închidere la click exterior:
- FodDropdown
- FodSelect
- FodPopover
- FodTooltip
- Meniuri custom

## Stilizare

Componenta adaugă doar un `div` wrapper cu un ID unic generat. Nu aplică stiluri proprii.

### Exemplu stilizare pentru dropdown

```css
/* Container dropdown */
.dropdown {
    position: relative;
    display: inline-block;
}

/* Meniu dropdown */
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 1000;
}

/* Context menu */
.context-menu {
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    padding: 0.5rem 0;
    z-index: 9999;
}
```

## Note și observații

1. **JavaScript dependency** - Necesită funcția JavaScript `outsideClickHandler.addEvent`
2. **ID unic** - Generează automat un GUID pentru identificare
3. **JSInterop** - Folosește JSInterop pentru comunicare cu JavaScript
4. **StateHasChanged** - Apelați manual în callback pentru re-randare
5. **Memory management** - JavaScript-ul trebuie să gestioneze corect event listeners

## Bune practici

1. **Un singur handler** - Folosiți o singură instanță pentru fiecare element interactiv
2. **StateHasChanged** - Apelați întotdeauna după modificarea stării în callback
3. **Cleanup** - Asigurați-vă că JavaScript-ul face cleanup la destroy
4. **Z-index** - Gestionați corect z-index pentru elementele overlay
5. **Event bubbling** - Opriți propagarea evenimentelor când este necesar

## Exemple avansate

### Cu multiple containere

```razor
@foreach (var item in items)
{
    <OutsideHandleContainer OnClickOutside="@(() => CloseItem(item.Id))">
        <div class="item-container">
            <button @onclick="@(() => ToggleItem(item.Id))">
                @item.Name
            </button>
            @if (openItems.Contains(item.Id))
            {
                <div class="item-details">
                    @item.Description
                </div>
            }
        </div>
    </OutsideHandleContainer>
}

@code {
    private HashSet<int> openItems = new();

    private void ToggleItem(int id)
    {
        if (openItems.Contains(id))
            openItems.Remove(id);
        else
            openItems.Add(id);
    }

    private void CloseItem(int id)
    {
        openItems.Remove(id);
        StateHasChanged();
    }
}
```

### Cu debounce

```razor
<OutsideHandleContainer OnClickOutside="@DebouncedClose">
    <div class="search-autocomplete">
        <input @bind="searchTerm" @bind:event="oninput" />
        @if (showResults && results.Any())
        {
            <div class="results">
                @foreach (var result in results)
                {
                    <div>@result</div>
                }
            </div>
        }
    </div>
</OutsideHandleContainer>

@code {
    private System.Timers.Timer debounceTimer;

    private void DebouncedClose()
    {
        debounceTimer?.Stop();
        debounceTimer = new System.Timers.Timer(200);
        debounceTimer.Elapsed += (s, e) =>
        {
            InvokeAsync(() =>
            {
                showResults = false;
                StateHasChanged();
            });
        };
        debounceTimer.Start();
    }
}
```

## Concluzie

OutsideHandleContainer oferă o soluție elegantă pentru detectarea click-urilor exterioare, esențială pentru crearea de componente UI interactive. Cu integrare simplă și flexibilitate maximă, permite implementarea pattern-ului "click outside to close" pentru diverse scenarii de interfață.