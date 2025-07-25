# AttributeHandlerService

## Documentație pentru serviciul AttributeHandlerService

### 1. Descriere Generală

`AttributeHandlerService` este un serviciu utilitar care gestionează extragerea și localizarea etichetelor pentru valorile enum folosind atributul `DisplayAttribute`. Serviciul facilitează generarea automată de opțiuni pentru componente de selecție cu suport complet pentru localizare.

Caracteristici principale:
- Extragere etichete din atributul Display
- Suport pentru localizare prin ResourceType
- Fallback automat la numele enum
- Integrare cu sistemul de localizare Blazor
- Cache intern pentru performanță
- Suport pentru toate tipurile de enum

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs

// Înregistrare automată prin AddFodComponents
builder.Services.AddFodComponents(configuration);

// Sau înregistrare manuală
builder.Services.AddScoped<IAttributeHandlerService, AttributeHandlerService>();

// Asigurați-vă că localizarea este configurată
builder.Services.AddLocalization(options => 
{
    options.ResourcesPath = "Resources";
});
```

### 3. Interfața IAttributeHandlerService

```csharp
namespace FOD.Components.Services
{
    public interface IAttributeHandlerService
    {
        string GetEnumLabel(object enumValue);
    }
}
```

### 4. Metode Disponibile

| Metodă | Parametri | Return | Descriere |
|--------|-----------|--------|-----------|
| `GetEnumLabel` | `object enumValue` | `string` | Obține eticheta localizată pentru o valoare enum |

### 5. Utilizare cu Atribute

#### Definire Enum cu Display Attribute
```csharp
public enum RequestorType
{
    [Display(Name = "Individual_Enum_Label", ResourceType = typeof(FodSharedResources))]
    Individual = 1,
    
    [Display(Name = "Organization_Enum_Label", ResourceType = typeof(FodSharedResources))]
    Organization = 2,
    
    [Display(Name = "Reprezentant legal")]  // Fără localizare
    LegalRepresentative = 3,
    
    OnBehalfOf = 4  // Fără atribut Display
}

public enum DocumentStatus
{
    [Display(Name = "DocumentStatus_Draft", ResourceType = typeof(DocumentResources))]
    Draft,
    
    [Display(Name = "DocumentStatus_InProgress", ResourceType = typeof(DocumentResources))]
    InProgress,
    
    [Display(Name = "DocumentStatus_Completed", ResourceType = typeof(DocumentResources))]
    Completed,
    
    [Display(Name = "DocumentStatus_Rejected", ResourceType = typeof(DocumentResources))]
    Rejected
}
```

### 6. Exemple de Utilizare

#### Utilizare directă în componente
```razor
@inject IAttributeHandlerService AttributeHandler

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Status Document: @AttributeHandler.GetEnumLabel(DocumentStatus.InProgress)
        </FodText>
        
        <!-- Afișare toate valorile enum -->
        <FodList>
            @foreach (var status in Enum.GetValues<DocumentStatus>())
            {
                <FodListItem>
                    <FodListItemIcon>
                        <FodIcon Color="@GetStatusColor(status)">
                            @GetStatusIcon(status)
                        </FodIcon>
                    </FodListItemIcon>
                    <FodListItemText>
                        @AttributeHandler.GetEnumLabel(status)
                    </FodListItemText>
                </FodListItem>
            }
        </FodList>
    </FodCardContent>
</FodCard>

@code {
    private FodColor GetStatusColor(DocumentStatus status)
    {
        return status switch
        {
            DocumentStatus.Draft => FodColor.Default,
            DocumentStatus.InProgress => FodColor.Warning,
            DocumentStatus.Completed => FodColor.Success,
            DocumentStatus.Rejected => FodColor.Error,
            _ => FodColor.Default
        };
    }
}
```

#### Integrare cu SelectableItemsService
```csharp
public class EnumOptionsGenerator
{
    private readonly IAttributeHandlerService _attributeHandler;
    
    public List<SelectableItem> GenerateOptions<TEnum>() where TEnum : Enum
    {
        return Enum.GetValues<TEnum>()
            .Select(value => new SelectableItem
            {
                Value = value,
                Text = _attributeHandler.GetEnumLabel(value)
            })
            .ToList();
    }
    
    public List<SelectableItem> GenerateOptionsWithFilter<TEnum>(
        Func<TEnum, bool> filter) where TEnum : Enum
    {
        return Enum.GetValues<TEnum>()
            .Where(filter)
            .Select(value => new SelectableItem
            {
                Value = value,
                Text = _attributeHandler.GetEnumLabel(value)
            })
            .ToList();
    }
}
```

#### Componente personalizate cu enum
```razor
@typeparam TEnum where TEnum : Enum
@inject IAttributeHandlerService AttributeHandler

<FodSelect @bind-Value="SelectedValue" Label="@Label">
    @foreach (var value in GetEnumValues())
    {
        <FodOption Value="@value">
            @AttributeHandler.GetEnumLabel(value)
        </FodOption>
    }
</FodSelect>

@code {
    [Parameter] public TEnum SelectedValue { get; set; }
    [Parameter] public EventCallback<TEnum> SelectedValueChanged { get; set; }
    [Parameter] public string Label { get; set; }
    [Parameter] public Func<TEnum, bool> Filter { get; set; }
    
    private IEnumerable<TEnum> GetEnumValues()
    {
        var values = Enum.GetValues<TEnum>();
        return Filter != null ? values.Where(Filter) : values;
    }
}
```

### 7. Serviciu extins cu cache

```csharp
public class CachedAttributeHandlerService : IAttributeHandlerService
{
    private readonly IAttributeHandlerService _innerService;
    private readonly ConcurrentDictionary<string, string> _cache = new();
    
    public string GetEnumLabel(object enumValue)
    {
        if (enumValue == null)
            return string.Empty;
        
        var key = $"{enumValue.GetType().FullName}_{enumValue}";
        
        return _cache.GetOrAdd(key, _ => _innerService.GetEnumLabel(enumValue));
    }
}

// Înregistrare
services.AddScoped<IAttributeHandlerService>(provider =>
{
    var innerService = new AttributeHandlerService(
        provider.GetRequiredService<IStringLocalizerFactory>());
    return new CachedAttributeHandlerService(innerService);
});
```

### 8. Localizare avansată

```csharp
public class EnhancedAttributeHandlerService : IAttributeHandlerService
{
    private readonly IStringLocalizerFactory _localizerFactory;
    private readonly ILogger<EnhancedAttributeHandlerService> _logger;
    private readonly IOptions<LocalizationOptions> _localizationOptions;
    
    public string GetEnumLabel(object enumValue)
    {
        if (enumValue == null)
            return string.Empty;
        
        var type = enumValue.GetType();
        if (!type.IsEnum)
        {
            _logger.LogWarning("GetEnumLabel called with non-enum type: {Type}", type);
            return enumValue.ToString();
        }
        
        var memberInfo = type.GetMember(enumValue.ToString()).FirstOrDefault();
        if (memberInfo == null)
            return enumValue.ToString();
        
        var displayAttribute = memberInfo.GetCustomAttribute<DisplayAttribute>();
        if (displayAttribute == null)
            return FormatEnumName(enumValue.ToString());
        
        // Localizare cu fallback
        if (displayAttribute.ResourceType != null && !string.IsNullOrEmpty(displayAttribute.Name))
        {
            try
            {
                var localizer = _localizerFactory.Create(displayAttribute.ResourceType);
                var localizedString = localizer[displayAttribute.Name];
                
                if (!localizedString.ResourceNotFound)
                {
                    return localizedString.Value;
                }
                
                _logger.LogWarning(
                    "Resource not found: {ResourceKey} in {ResourceType}", 
                    displayAttribute.Name, 
                    displayAttribute.ResourceType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Error localizing enum value {EnumValue}", 
                    enumValue);
            }
        }
        
        // Fallback la Display.Name sau nume formatat
        return !string.IsNullOrEmpty(displayAttribute.Name) 
            ? displayAttribute.Name 
            : FormatEnumName(enumValue.ToString());
    }
    
    private string FormatEnumName(string enumName)
    {
        // Convertește PascalCase în text lizibil
        // Ex: "InProgress" -> "In Progress"
        return Regex.Replace(enumName, "([a-z])([A-Z])", "$1 $2");
    }
}
```

### 9. Utilizare în formulare dinamice

```razor
@inject IAttributeHandlerService AttributeHandler
@inject ISelectableItemsService SelectableItemsService

<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" GutterBottom="true">
            Formular Dinamic
        </FodText>
        
        @foreach (var field in formFields)
        {
            <div class="mb-3">
                @if (field.FieldType.IsEnum)
                {
                    <FodSelect @bind-Value="field.Value" 
                               Label="@field.DisplayName"
                               Items="@GetEnumOptions(field.FieldType)"
                               Required="@field.IsRequired" />
                }
                else if (field.FieldType == typeof(bool))
                {
                    <FodCheckbox @bind-Value="field.Value" 
                                 Label="@field.DisplayName" />
                }
                else
                {
                    <FodInput @bind-Value="field.Value" 
                              Label="@field.DisplayName"
                              Required="@field.IsRequired" />
                }
            </div>
        }
    </FodCardContent>
</FodCard>

@code {
    private List<DynamicFormField> formFields = new();
    
    private List<SelectableItem> GetEnumOptions(Type enumType)
    {
        if (SelectableItemsService.TryGetEnumSelectableItems(enumType, out var items))
        {
            return items.ToList();
        }
        
        // Fallback manual
        return Enum.GetValues(enumType)
            .Cast<object>()
            .Select(value => new SelectableItem
            {
                Value = value,
                Text = AttributeHandler.GetEnumLabel(value)
            })
            .ToList();
    }
}
```

### 10. Grupare enum-uri

```csharp
public class GroupedEnumService
{
    private readonly IAttributeHandlerService _attributeHandler;
    
    public List<GroupedSelectableItem> GetGroupedEnumOptions<TEnum>() where TEnum : Enum
    {
        var grouped = new Dictionary<string, List<SelectableItem>>();
        
        foreach (var value in Enum.GetValues<TEnum>())
        {
            var memberInfo = typeof(TEnum).GetMember(value.ToString()).First();
            var categoryAttribute = memberInfo.GetCustomAttribute<CategoryAttribute>();
            var category = categoryAttribute?.Category ?? "General";
            
            if (!grouped.ContainsKey(category))
            {
                grouped[category] = new List<SelectableItem>();
            }
            
            grouped[category].Add(new SelectableItem
            {
                Value = value,
                Text = _attributeHandler.GetEnumLabel(value)
            });
        }
        
        return grouped.Select(g => new GroupedSelectableItem
        {
            GroupName = g.Key,
            Items = g.Value
        }).ToList();
    }
}

// Utilizare
public enum ServiceType
{
    [Display(Name = "Birth_Certificate", ResourceType = typeof(Resources))]
    [Category("Documente de Stare Civilă")]
    BirthCertificate,
    
    [Display(Name = "Marriage_Certificate", ResourceType = typeof(Resources))]
    [Category("Documente de Stare Civilă")]
    MarriageCertificate,
    
    [Display(Name = "Business_License", ResourceType = typeof(Resources))]
    [Category("Licențe și Autorizații")]
    BusinessLicense,
    
    [Display(Name = "Building_Permit", ResourceType = typeof(Resources))]
    [Category("Licențe și Autorizații")]
    BuildingPermit
}
```

### 11. Extensie pentru descrieri

```csharp
public interface IExtendedAttributeHandlerService : IAttributeHandlerService
{
    string GetEnumDescription(object enumValue);
    string GetEnumShortName(object enumValue);
    int? GetEnumOrder(object enumValue);
}

public class ExtendedAttributeHandlerService : AttributeHandlerService, IExtendedAttributeHandlerService
{
    public ExtendedAttributeHandlerService(IStringLocalizerFactory stringLocalizerFactory) 
        : base(stringLocalizerFactory)
    {
    }
    
    public string GetEnumDescription(object enumValue)
    {
        var memberInfo = GetMemberInfo(enumValue);
        var attribute = memberInfo?.GetCustomAttribute<DisplayAttribute>();
        
        if (attribute?.ResourceType != null && !string.IsNullOrEmpty(attribute.Description))
        {
            var localizer = StringLocalizerFactory.Create(attribute.ResourceType);
            var localized = localizer[attribute.Description];
            if (!localized.ResourceNotFound)
                return localized.Value;
        }
        
        return attribute?.Description ?? string.Empty;
    }
    
    public string GetEnumShortName(object enumValue)
    {
        var memberInfo = GetMemberInfo(enumValue);
        var attribute = memberInfo?.GetCustomAttribute<DisplayAttribute>();
        
        if (attribute?.ResourceType != null && !string.IsNullOrEmpty(attribute.ShortName))
        {
            var localizer = StringLocalizerFactory.Create(attribute.ResourceType);
            var localized = localizer[attribute.ShortName];
            if (!localized.ResourceNotFound)
                return localized.Value;
        }
        
        return attribute?.ShortName ?? enumValue.ToString();
    }
    
    public int? GetEnumOrder(object enumValue)
    {
        var memberInfo = GetMemberInfo(enumValue);
        var attribute = memberInfo?.GetCustomAttribute<DisplayAttribute>();
        return attribute?.GetOrder();
    }
    
    private MemberInfo GetMemberInfo(object enumValue)
    {
        if (enumValue == null) return null;
        
        var type = enumValue.GetType();
        if (!type.IsEnum) return null;
        
        return type.GetMember(enumValue.ToString()).FirstOrDefault();
    }
}
```

### 12. Testare

```csharp
[TestClass]
public class AttributeHandlerServiceTests
{
    private IAttributeHandlerService _service;
    private Mock<IStringLocalizerFactory> _localizerFactoryMock;
    
    [TestInitialize]
    public void Setup()
    {
        _localizerFactoryMock = new Mock<IStringLocalizerFactory>();
        _service = new AttributeHandlerService(_localizerFactoryMock.Object);
    }
    
    [TestMethod]
    public void GetEnumLabel_WithDisplayAttribute_ReturnsDisplayName()
    {
        // Arrange
        var enumValue = TestEnum.WithDisplay;
        
        // Act
        var result = _service.GetEnumLabel(enumValue);
        
        // Assert
        Assert.AreEqual("Display Name", result);
    }
    
    [TestMethod]
    public void GetEnumLabel_WithLocalization_ReturnsLocalizedText()
    {
        // Arrange
        var enumValue = TestEnum.WithLocalization;
        var localizerMock = new Mock<IStringLocalizer>();
        localizerMock.Setup(l => l["TestKey"])
            .Returns(new LocalizedString("TestKey", "Localized Text"));
        
        _localizerFactoryMock.Setup(f => f.Create(It.IsAny<Type>()))
            .Returns(localizerMock.Object);
        
        // Act
        var result = _service.GetEnumLabel(enumValue);
        
        // Assert
        Assert.AreEqual("Localized Text", result);
    }
    
    [TestMethod]
    public void GetEnumLabel_WithoutDisplay_ReturnsEnumName()
    {
        // Arrange
        var enumValue = TestEnum.NoDisplay;
        
        // Act
        var result = _service.GetEnumLabel(enumValue);
        
        // Assert
        Assert.AreEqual("NoDisplay", result);
    }
    
    private enum TestEnum
    {
        [Display(Name = "Display Name")]
        WithDisplay,
        
        [Display(Name = "TestKey", ResourceType = typeof(TestResources))]
        WithLocalization,
        
        NoDisplay
    }
}
```

### 13. Best Practices

1. **Folosiți Display Attribute** - Definiți întotdeauna Display pentru enum-uri UI
2. **Localizare consistentă** - Folosiți ResourceType pentru texte multilingve
3. **Cache rezultate** - Implementați cache pentru performanță
4. **Fallback graceful** - Asigurați afișare corectă chiar fără atribute
5. **Validare tip** - Verificați că parametrul este enum
6. **Logging** - Înregistrați erori de localizare pentru debugging
7. **Convenții nume** - Folosiți convenții consistente pentru chei de resurse

### 14. Concluzie

`AttributeHandlerService` este un serviciu esențial pentru gestionarea etichetelor enum în aplicațiile FOD, oferind suport complet pentru localizare și integrare seamless cu componentele UI. Prin abstractizarea logicii de extragere a etichetelor, serviciul facilitează dezvoltarea rapidă de interfețe multilingve și mentenabile.