# KeyInterceptor

## Documentație pentru serviciul KeyInterceptor

### 1. Descriere Generală

`KeyInterceptor` este un serviciu avansat pentru interceptarea și gestionarea evenimentelor de tastatură în componentele Blazor. Oferă control granular asupra comportamentului tastelor, permițând prevenirea acțiunilor implicite și gestionarea combinațiilor complexe de taste.

Caracteristici principale:
- Interceptare evenimente keyboard pe elemente specifice
- Suport pentru combinații de taste (Ctrl, Alt, Shift, Meta)
- Prevenire comportament implicit (preventDefault)
- Control propagare evenimente (stopPropagation)
- Potrivire taste cu expresii regulate
- Monitorizare automată DOM cu MutationObserver
- Actualizare dinamică configurație taste

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped<IKeyInterceptorFactory, KeyInterceptorFactory>();
```

### 3. Interfețe și Clase

#### IKeyInterceptor
```csharp
public interface IKeyInterceptor : IDisposable
{
    Task Connect(string elementId, KeyInterceptorOptions options);
    Task Disconnect();
    Task UpdateKey(KeyOptions key);
    
    event Action<KeyboardEventArgs> KeyDown;
    event Action<KeyboardEventArgs> KeyUp;
}
```

#### IKeyInterceptorFactory
```csharp
public interface IKeyInterceptorFactory
{
    IKeyInterceptor Create();
}
```

### 4. Modele de Date

#### KeyInterceptorOptions
```csharp
public class KeyInterceptorOptions
{
    // Clasa CSS a elementelor de monitorizat
    public string TargetClass { get; set; } = "fod-input-control";
    
    // Lista de taste și comportamente
    public List<KeyOptions> Keys { get; set; } = new();
}
```

#### KeyOptions
```csharp
public class KeyOptions
{
    // Tasta sau pattern regex pentru taste multiple
    public string Key { get; set; }
    
    // Previne keydown: "key+none", "key+ctrl", "key+shift", etc.
    public string PreventDown { get; set; }
    
    // Previne keyup
    public string PreventUp { get; set; }
    
    // Oprește propagarea pentru keydown
    public string StopDown { get; set; }
    
    // Oprește propagarea pentru keyup
    public string StopUp { get; set; }
}
```

#### KeyboardEventArgs
```csharp
public class KeyboardEventArgs : EventArgs
{
    public string Key { get; set; }
    public string Code { get; set; }
    public float Location { get; set; }
    public bool Repeat { get; set; }
    public bool CtrlKey { get; set; }
    public bool ShiftKey { get; set; }
    public bool AltKey { get; set; }
    public bool MetaKey { get; set; }
    public string Type { get; set; }
}
```

### 5. Exemple de Utilizare

#### Interceptor simplu pentru input
```razor
@implements IAsyncDisposable
@inject IKeyInterceptorFactory KeyInterceptorFactory

<div id="@_elementId">
    <FodInput @bind-Value="searchText" 
              Class="fod-input-control"
              Placeholder="Caută (Ctrl+K pentru focus)" />
    
    <FodText Typo="Typo.caption" Class="mt-2">
        Shortcuts: Ctrl+K (focus), Escape (clear), Enter (search)
    </FodText>
</div>

@code {
    private string _elementId = $"search-{Guid.NewGuid()}";
    private string searchText;
    private IKeyInterceptor _keyInterceptor;
    private ElementReference inputElement;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await InitializeKeyInterceptor();
        }
    }
    
    private async Task InitializeKeyInterceptor()
    {
        _keyInterceptor = KeyInterceptorFactory.Create();
        
        var options = new KeyInterceptorOptions
        {
            TargetClass = "fod-input-control",
            Keys = new List<KeyOptions>
            {
                // Ctrl+K pentru focus
                new KeyOptions 
                { 
                    Key = "k", 
                    PreventDown = "key+ctrl",
                    StopDown = "key+ctrl"
                },
                // Escape pentru clear
                new KeyOptions 
                { 
                    Key = "Escape",
                    PreventDown = "key+none"
                },
                // Enter pentru search
                new KeyOptions 
                { 
                    Key = "Enter",
                    PreventDown = "key+none"
                }
            }
        };
        
        await _keyInterceptor.Connect(_elementId, options);
        _keyInterceptor.KeyDown += OnKeyDown;
    }
    
    private async void OnKeyDown(KeyboardEventArgs args)
    {
        await InvokeAsync(async () =>
        {
            switch (args.Key)
            {
                case "k" when args.CtrlKey:
                    await FocusInput();
                    break;
                    
                case "Escape":
                    searchText = string.Empty;
                    StateHasChanged();
                    break;
                    
                case "Enter":
                    await PerformSearch();
                    break;
            }
        });
    }
    
    private async Task FocusInput()
    {
        await inputElement.FocusAsync();
    }
    
    private async Task PerformSearch()
    {
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            // Execută căutarea
            await SearchService.Search(searchText);
        }
    }
    
    public async ValueTask DisposeAsync()
    {
        if (_keyInterceptor != null)
        {
            await _keyInterceptor.Disconnect();
            _keyInterceptor.Dispose();
        }
    }
}
```

#### Dropdown cu navigare tastatură
```razor
@inject IKeyInterceptorFactory KeyInterceptorFactory

<div id="@_dropdownId" class="dropdown-container">
    <FodInput @bind-Value="selectedText"
              @onfocus="ShowDropdown"
              Class="dropdown-input fod-input-control"
              Placeholder="Selectați opțiune..." />
    
    @if (isOpen)
    {
        <FodPaper Class="dropdown-menu" Elevation="4">
            <FodList>
                @for (int i = 0; i < options.Count; i++)
                {
                    var index = i;
                    <FodListItem Class="@GetItemClass(index)"
                                 OnClick="() => SelectOption(index)">
                        @options[index]
                    </FodListItem>
                }
            </FodList>
        </FodPaper>
    }
</div>

@code {
    private string _dropdownId = $"dropdown-{Guid.NewGuid()}";
    private IKeyInterceptor _keyInterceptor;
    private List<string> options = new() { "Opțiune 1", "Opțiune 2", "Opțiune 3", "Opțiune 4" };
    private string selectedText;
    private bool isOpen;
    private int highlightedIndex = -1;
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await SetupKeyboardNavigation();
        }
    }
    
    private async Task SetupKeyboardNavigation()
    {
        _keyInterceptor = KeyInterceptorFactory.Create();
        
        var options = new KeyInterceptorOptions
        {
            TargetClass = "dropdown-input",
            Keys = new List<KeyOptions>
            {
                // Navigare cu săgeți
                new KeyOptions 
                { 
                    Key = "ArrowDown",
                    PreventDown = "key+none",
                    StopDown = "key+none"
                },
                new KeyOptions 
                { 
                    Key = "ArrowUp",
                    PreventDown = "key+none",
                    StopDown = "key+none"
                },
                // Selectare cu Enter
                new KeyOptions 
                { 
                    Key = "Enter",
                    PreventDown = "key+none"
                },
                // Închidere cu Escape
                new KeyOptions 
                { 
                    Key = "Escape",
                    PreventDown = "key+none"
                },
                // Deschidere cu Space
                new KeyOptions 
                { 
                    Key = " ",
                    PreventDown = "key+none"
                },
                // Home/End pentru navigare rapidă
                new KeyOptions 
                { 
                    Key = "Home",
                    PreventDown = "key+none"
                },
                new KeyOptions 
                { 
                    Key = "End",
                    PreventDown = "key+none"
                }
            }
        };
        
        await _keyInterceptor.Connect(_dropdownId, options);
        _keyInterceptor.KeyDown += HandleDropdownKeyboard;
    }
    
    private async void HandleDropdownKeyboard(KeyboardEventArgs args)
    {
        await InvokeAsync(() =>
        {
            switch (args.Key)
            {
                case "ArrowDown":
                    if (!isOpen)
                    {
                        ShowDropdown();
                    }
                    else
                    {
                        highlightedIndex = Math.Min(highlightedIndex + 1, options.Count - 1);
                    }
                    break;
                    
                case "ArrowUp":
                    if (isOpen)
                    {
                        highlightedIndex = Math.Max(highlightedIndex - 1, 0);
                    }
                    break;
                    
                case "Enter":
                    if (isOpen && highlightedIndex >= 0)
                    {
                        SelectOption(highlightedIndex);
                    }
                    break;
                    
                case "Escape":
                    CloseDropdown();
                    break;
                    
                case " ":
                    if (!isOpen)
                    {
                        ShowDropdown();
                    }
                    break;
                    
                case "Home":
                    if (isOpen)
                    {
                        highlightedIndex = 0;
                    }
                    break;
                    
                case "End":
                    if (isOpen)
                    {
                        highlightedIndex = options.Count - 1;
                    }
                    break;
            }
            
            StateHasChanged();
        });
    }
    
    private void ShowDropdown()
    {
        isOpen = true;
        highlightedIndex = 0;
    }
    
    private void CloseDropdown()
    {
        isOpen = false;
        highlightedIndex = -1;
    }
    
    private void SelectOption(int index)
    {
        selectedText = options[index];
        CloseDropdown();
    }
    
    private string GetItemClass(int index)
    {
        return index == highlightedIndex ? "highlighted" : "";
    }
}
```

#### Editor cu shortcuts personalizate
```razor
@inject IKeyInterceptorFactory KeyInterceptorFactory
@inject IJSRuntime JSRuntime

<div id="@_editorId">
    <FodToolbar>
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatBold"
                       OnClick="() => ApplyFormat('bold')"
                       Tooltip="Bold (Ctrl+B)" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatItalic"
                       OnClick="() => ApplyFormat('italic')"
                       Tooltip="Italic (Ctrl+I)" />
        <FodIconButton Icon="@FodIcons.Material.Filled.FormatUnderlined"
                       OnClick="() => ApplyFormat('underline')"
                       Tooltip="Underline (Ctrl+U)" />
        <FodDivider Orientation="Orientation.Vertical" />
        <FodIconButton Icon="@FodIcons.Material.Filled.Save"
                       OnClick="SaveContent"
                       Tooltip="Save (Ctrl+S)" />
    </FodToolbar>
    
    <div @ref="editorElement" 
         contenteditable="true"
         class="editor-content fod-input-control"
         @oninput="OnContentChanged">
        @((MarkupString)content)
    </div>
</div>

@code {
    private string _editorId = $"editor-{Guid.NewGuid()}";
    private IKeyInterceptor _keyInterceptor;
    private ElementReference editorElement;
    private string content = "<p>Începeți să scrieți...</p>";
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await SetupEditorShortcuts();
        }
    }
    
    private async Task SetupEditorShortcuts()
    {
        _keyInterceptor = KeyInterceptorFactory.Create();
        
        var options = new KeyInterceptorOptions
        {
            TargetClass = "editor-content",
            Keys = new List<KeyOptions>
            {
                // Formatare text
                new KeyOptions { Key = "b", PreventDown = "key+ctrl" },
                new KeyOptions { Key = "i", PreventDown = "key+ctrl" },
                new KeyOptions { Key = "u", PreventDown = "key+ctrl" },
                
                // Salvare
                new KeyOptions { Key = "s", PreventDown = "key+ctrl" },
                
                // Undo/Redo custom
                new KeyOptions { Key = "z", PreventDown = "key+ctrl+shift" },
                
                // Inserare link
                new KeyOptions { Key = "k", PreventDown = "key+ctrl" },
                
                // Clear formatting
                new KeyOptions { Key = "\\", PreventDown = "key+ctrl" }
            }
        };
        
        await _keyInterceptor.Connect(_editorId, options);
        _keyInterceptor.KeyDown += HandleEditorShortcuts;
    }
    
    private async void HandleEditorShortcuts(KeyboardEventArgs args)
    {
        await InvokeAsync(async () =>
        {
            if (args.CtrlKey)
            {
                switch (args.Key)
                {
                    case "b":
                        await ApplyFormat("bold");
                        break;
                    case "i":
                        await ApplyFormat("italic");
                        break;
                    case "u":
                        await ApplyFormat("underline");
                        break;
                    case "s":
                        await SaveContent();
                        break;
                    case "k":
                        await InsertLink();
                        break;
                    case "\\":
                        await ClearFormatting();
                        break;
                    case "z" when args.ShiftKey:
                        await Redo();
                        break;
                }
            }
        });
    }
    
    private async Task ApplyFormat(string command)
    {
        await JSRuntime.InvokeVoidAsync("document.execCommand", command, false, null);
    }
    
    private async Task SaveContent()
    {
        NotificationService.Success("Conținut salvat!");
        // Implementare salvare
    }
    
    private async Task InsertLink()
    {
        var url = await JSRuntime.InvokeAsync<string>("prompt", "Introduceți URL:");
        if (!string.IsNullOrEmpty(url))
        {
            await JSRuntime.InvokeVoidAsync("document.execCommand", "createLink", false, url);
        }
    }
}
```

### 6. Actualizare dinamică taste

```csharp
public class DynamicKeyInterceptor
{
    private readonly IKeyInterceptor _keyInterceptor;
    private readonly List<KeyOptions> _currentKeys = new();
    
    public async Task AddShortcut(string key, string modifier, Func<Task> action)
    {
        var keyOption = new KeyOptions
        {
            Key = key,
            PreventDown = $"key+{modifier}",
            StopDown = $"key+{modifier}"
        };
        
        _currentKeys.Add(keyOption);
        await _keyInterceptor.UpdateKey(keyOption);
        
        // Stochează acțiunea asociată
        _shortcuts[GetShortcutKey(key, modifier)] = action;
    }
    
    public async Task RemoveShortcut(string key, string modifier)
    {
        var keyToRemove = _currentKeys.FirstOrDefault(k => 
            k.Key == key && k.PreventDown.Contains(modifier));
        
        if (keyToRemove != null)
        {
            _currentKeys.Remove(keyToRemove);
            // Actualizare prin reconectare
            await RefreshInterceptor();
        }
    }
    
    public async Task EnableShortcuts()
    {
        foreach (var key in _currentKeys)
        {
            await _keyInterceptor.UpdateKey(key);
        }
    }
    
    public async Task DisableShortcuts()
    {
        // Dezactivare temporară prin eliminare preventDefault
        foreach (var key in _currentKeys)
        {
            var disabledKey = new KeyOptions { Key = key.Key };
            await _keyInterceptor.UpdateKey(disabledKey);
        }
    }
}
```

### 7. Pattern pentru componente complexe

```csharp
public abstract class KeyboardEnabledComponent : ComponentBase, IAsyncDisposable
{
    [Inject] protected IKeyInterceptorFactory KeyInterceptorFactory { get; set; }
    
    protected IKeyInterceptor KeyInterceptor { get; private set; }
    protected string ComponentId { get; } = $"component-{Guid.NewGuid()}";
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await InitializeKeyboard();
        }
        
        await base.OnAfterRenderAsync(firstRender);
    }
    
    protected virtual async Task InitializeKeyboard()
    {
        KeyInterceptor = KeyInterceptorFactory.Create();
        
        var options = new KeyInterceptorOptions
        {
            TargetClass = GetTargetClass(),
            Keys = GetKeyOptions()
        };
        
        await KeyInterceptor.Connect(ComponentId, options);
        KeyInterceptor.KeyDown += OnKeyDown;
        KeyInterceptor.KeyUp += OnKeyUp;
    }
    
    protected abstract string GetTargetClass();
    protected abstract List<KeyOptions> GetKeyOptions();
    
    protected virtual void OnKeyDown(KeyboardEventArgs args)
    {
        InvokeAsync(() => HandleKeyDown(args));
    }
    
    protected virtual void OnKeyUp(KeyboardEventArgs args)
    {
        InvokeAsync(() => HandleKeyUp(args));
    }
    
    protected abstract Task HandleKeyDown(KeyboardEventArgs args);
    protected virtual Task HandleKeyUp(KeyboardEventArgs args) => Task.CompletedTask;
    
    public virtual async ValueTask DisposeAsync()
    {
        if (KeyInterceptor != null)
        {
            KeyInterceptor.KeyDown -= OnKeyDown;
            KeyInterceptor.KeyUp -= OnKeyUp;
            await KeyInterceptor.Disconnect();
            KeyInterceptor.Dispose();
        }
    }
}
```

### 8. JavaScript Integration

```javascript
// fodKeyInterceptor.js - Sistem avansat de interceptare taste
window.fodKeyInterceptor = {
    instances: new Map(),
    
    connect: function(elementId, dotNetRef, options) {
        const instance = {
            elementId: elementId,
            dotNetRef: dotNetRef,
            options: options,
            observer: null,
            handlers: new Map()
        };
        
        // Configurare observer pentru elemente dinamice
        instance.observer = new MutationObserver((mutations) => {
            this.updateHandlers(instance);
        });
        
        const container = document.getElementById(elementId);
        if (container) {
            instance.observer.observe(container, {
                childList: true,
                subtree: true
            });
            
            this.updateHandlers(instance);
        }
        
        this.instances.set(elementId, instance);
    },
    
    updateHandlers: function(instance) {
        const container = document.getElementById(instance.elementId);
        if (!container) return;
        
        const elements = container.querySelectorAll(`.${instance.options.targetClass}`);
        
        elements.forEach(element => {
            if (!instance.handlers.has(element)) {
                const handler = (event) => this.handleKeyEvent(event, instance);
                
                element.addEventListener('keydown', handler);
                element.addEventListener('keyup', handler);
                
                instance.handlers.set(element, handler);
            }
        });
        
        // Cleanup pentru elemente eliminate
        instance.handlers.forEach((handler, element) => {
            if (!container.contains(element)) {
                element.removeEventListener('keydown', handler);
                element.removeEventListener('keyup', handler);
                instance.handlers.delete(element);
            }
        });
    },
    
    handleKeyEvent: function(event, instance) {
        const keyOptions = this.findKeyOptions(event, instance.options.keys);
        if (!keyOptions) return;
        
        const shouldPrevent = this.shouldPrevent(event, keyOptions);
        const shouldStop = this.shouldStop(event, keyOptions);
        
        if (shouldPrevent) {
            event.preventDefault();
        }
        
        if (shouldStop) {
            event.stopPropagation();
        }
        
        // Trimite eveniment la .NET
        const eventArgs = {
            key: event.key,
            code: event.code,
            location: event.location,
            repeat: event.repeat,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
            type: event.type
        };
        
        instance.dotNetRef.invokeMethodAsync(
            event.type === 'keydown' ? 'OnKeyDown' : 'OnKeyUp',
            eventArgs
        );
    },
    
    findKeyOptions: function(event, keys) {
        return keys.find(keyOption => {
            if (keyOption.key.includes('/') && keyOption.key.includes('/')) {
                // Regex pattern
                const pattern = keyOption.key.slice(1, -1);
                const regex = new RegExp(pattern);
                return regex.test(event.key);
            }
            return keyOption.key === event.key;
        });
    },
    
    shouldPrevent: function(event, keyOptions) {
        const preventKey = event.type === 'keydown' 
            ? keyOptions.preventDown 
            : keyOptions.preventUp;
            
        return this.matchesModifiers(event, preventKey);
    },
    
    shouldStop: function(event, keyOptions) {
        const stopKey = event.type === 'keydown' 
            ? keyOptions.stopDown 
            : keyOptions.stopUp;
            
        return this.matchesModifiers(event, stopKey);
    },
    
    matchesModifiers: function(event, modifierString) {
        if (!modifierString) return false;
        
        const parts = modifierString.split('+');
        const hasKey = parts.includes('key');
        const hasCtrl = parts.includes('ctrl');
        const hasShift = parts.includes('shift');
        const hasAlt = parts.includes('alt');
        const hasMeta = parts.includes('meta');
        const hasNone = parts.includes('none');
        
        if (hasNone) {
            return hasKey && !event.ctrlKey && !event.shiftKey && 
                   !event.altKey && !event.metaKey;
        }
        
        return hasKey &&
               (!hasCtrl || event.ctrlKey) &&
               (!hasShift || event.shiftKey) &&
               (!hasAlt || event.altKey) &&
               (!hasMeta || event.metaKey);
    },
    
    disconnect: function(elementId) {
        const instance = this.instances.get(elementId);
        if (instance) {
            if (instance.observer) {
                instance.observer.disconnect();
            }
            
            instance.handlers.forEach((handler, element) => {
                element.removeEventListener('keydown', handler);
                element.removeEventListener('keyup', handler);
            });
            
            this.instances.delete(elementId);
        }
    },
    
    updateKey: function(elementId, keyOption) {
        const instance = this.instances.get(elementId);
        if (instance) {
            const existingIndex = instance.options.keys.findIndex(k => 
                k.key === keyOption.key);
                
            if (existingIndex >= 0) {
                instance.options.keys[existingIndex] = keyOption;
            } else {
                instance.options.keys.push(keyOption);
            }
        }
    }
};
```

### 9. Testare

```csharp
[TestClass]
public class KeyInterceptorTests
{
    private Mock<IJSRuntime> _jsRuntime;
    private IKeyInterceptor _keyInterceptor;
    private List<KeyboardEventArgs> _keyDownEvents;
    
    [TestInitialize]
    public void Setup()
    {
        _jsRuntime = new Mock<IJSRuntime>();
        _keyInterceptor = new KeyInterceptor(_jsRuntime.Object);
        _keyDownEvents = new List<KeyboardEventArgs>();
        _keyInterceptor.KeyDown += args => _keyDownEvents.Add(args);
    }
    
    [TestMethod]
    public async Task Connect_ValidOptions_CallsJavaScript()
    {
        // Arrange
        var elementId = "test-element";
        var options = new KeyInterceptorOptions
        {
            TargetClass = "test-class",
            Keys = new List<KeyOptions>
            {
                new KeyOptions { Key = "Enter", PreventDown = "key+none" }
            }
        };
        
        // Act
        await _keyInterceptor.Connect(elementId, options);
        
        // Assert
        _jsRuntime.Verify(js => js.InvokeVoidAsync(
            "fodKeyInterceptor.connect",
            It.IsAny<object[]>()), Times.Once);
    }
    
    [TestMethod]
    public void OnKeyDown_FiresEvent()
    {
        // Arrange
        var keyEvent = new KeyboardEventArgs
        {
            Key = "Enter",
            Type = "keydown"
        };
        
        // Act
        _keyInterceptor.InvokeKeyDown(keyEvent);
        
        // Assert
        Assert.AreEqual(1, _keyDownEvents.Count);
        Assert.AreEqual("Enter", _keyDownEvents[0].Key);
    }
}
```

### 10. Best Practices

1. **Dispose obligatoriu** - Întotdeauna apelați Disconnect și Dispose
2. **Target specific** - Folosiți clase CSS specifice pentru targeting
3. **Modifiers clare** - Definiți clar combinațiile de taste
4. **Prevent cu grijă** - Nu preveniți taste sistem importante
5. **Documentare shortcuts** - Afișați shortcuts disponibile utilizatorilor
6. **Accessibility** - Asigurați alternative pentru toate shortcuts
7. **Testing** - Testați pe diferite browsere și OS-uri

### 11. Concluzie

`KeyInterceptor` oferă un sistem robust și flexibil pentru gestionarea evenimentelor de tastatură în componentele Blazor. Cu suport pentru combinații complexe de taste, monitorizare automată DOM și control granular asupra comportamentului, serviciul facilitează crearea de interfețe cu shortcuts intuitive și experiențe de navigare eficiente cu tastatura.