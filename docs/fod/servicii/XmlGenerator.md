# XmlGenerator

## Documentație pentru serviciul XmlGenerator

### 1. Descriere Generală

`XmlGenerator` este un serviciu server-side care serializează obiecte .NET în format XML, cu suport pentru canonicalizare XML și atribute personalizate de descriere. Serviciul este optimizat pentru generarea de documente XML standardizate necesare în comunicarea cu sistemele guvernamentale.

Caracteristici principale:
- Serializare automată a obiectelor în XML
- Suport pentru atributul XmlDescription
- Canonicalizare XML (C14N)
- Formatare cu indentare pentru lizibilitate
- Suport pentru array-uri de string-uri
- Encoding UTF-8

### 2. Configurare și Înregistrare

```csharp
// Program.cs sau Startup.cs (server-side)
builder.Services.AddScoped<IXmlGenerator, XmlGenerator>();

// În modulul Server.ServicesSetup
public static IServiceCollection AddServerServices(this IServiceCollection services)
{
    services.AddScoped<IXmlGenerator, XmlGenerator>();
    return services;
}
```

### 3. Interfață

```csharp
public interface IXmlGenerator
{
    string Generate(object document);
}
```

### 4. Metodă Disponibilă

#### Generate
Generează un document XML din obiectul furnizat.

**Parametri:**
- `document` (object) - Obiectul de serializat în XML

**Returnează:**
- `string` - Document XML canonicalizat ca string

**Caracteristici:**
- Numele clasei devine elementul root
- Proprietățile devin elemente XML
- Suport pentru atributul `XmlDescriptionAttribute`
- Array-urile de string-uri sunt serializate ca elemente separate
- Aplicare transformare C14N pentru standardizare

### 5. Atribut XmlDescription

```csharp
[AttributeUsage(AttributeTargets.Property)]
public class XmlDescriptionAttribute : Attribute
{
    public string Value { get; set; } = string.Empty;
}
```

Utilizat pentru a adăuga atribute "Title" la elementele XML generate.

### 6. Exemple de Utilizare

#### Model simplu cu atribute
```csharp
public class ServiceRequest
{
    [XmlDescription(Value = "Număr de înregistrare")]
    public string OrderNumber { get; set; }
    
    [XmlDescription(Value = "Data depunerii")]
    public DateTime SubmissionDate { get; set; }
    
    [XmlDescription(Value = "Numele solicitantului")]
    public string ApplicantName { get; set; }
    
    [XmlDescription(Value = "Documente anexate")]
    public string[] AttachedDocuments { get; set; }
}

public class XmlDocumentService
{
    private readonly IXmlGenerator _xmlGenerator;
    
    public XmlDocumentService(IXmlGenerator xmlGenerator)
    {
        _xmlGenerator = xmlGenerator;
    }
    
    public string GenerateRequestXml(ServiceRequest request)
    {
        var xml = _xmlGenerator.Generate(request);
        return xml;
        
        /* Rezultat:
        <ServiceRequest>
            <OrderNumber Title="Număr de înregistrare">SR001240630143025</OrderNumber>
            <SubmissionDate Title="Data depunerii">2024-06-30T14:30:25</SubmissionDate>
            <ApplicantName Title="Numele solicitantului">Ion Popescu</ApplicantName>
            <AttachedDocuments Title="Documente anexate">
                <string>Cerere.pdf</string>
                <string>BuletinIdentitate.pdf</string>
                <string>Certificat.pdf</string>
            </AttachedDocuments>
        </ServiceRequest>
        */
    }
}
```

#### Generare XML pentru raportare
```csharp
public class ReportData
{
    [XmlDescription(Value = "Perioada de raportare")]
    public string ReportPeriod { get; set; }
    
    [XmlDescription(Value = "Total cereri procesate")]
    public int TotalRequests { get; set; }
    
    [XmlDescription(Value = "Cereri aprobate")]
    public int ApprovedRequests { get; set; }
    
    [XmlDescription(Value = "Timp mediu de procesare (ore)")]
    public double AverageProcessingTime { get; set; }
    
    [XmlDescription(Value = "Tipuri de servicii")]
    public string[] ServiceTypes { get; set; }
}

public class ReportingService
{
    private readonly IXmlGenerator _xmlGenerator;
    private readonly ILogger<ReportingService> _logger;
    
    public async Task<string> GenerateMonthlyReport(int year, int month)
    {
        var reportData = new ReportData
        {
            ReportPeriod = $"{year}-{month:D2}",
            TotalRequests = 1250,
            ApprovedRequests = 1180,
            AverageProcessingTime = 24.5,
            ServiceTypes = new[] { "Apostilă", "Certificate", "Traduceri" }
        };
        
        var xml = _xmlGenerator.Generate(reportData);
        
        _logger.LogInformation("Raport XML generat pentru perioada {Period}", 
            reportData.ReportPeriod);
        
        return xml;
    }
}
```

#### Export date pentru integrare
```csharp
public class IntegrationData
{
    [XmlDescription(Value = "Identificator sistem")]
    public string SystemId { get; set; }
    
    [XmlDescription(Value = "Versiune API")]
    public string ApiVersion { get; set; }
    
    [XmlDescription(Value = "Timestamp")]
    public DateTime Timestamp { get; set; }
    
    [XmlDescription(Value = "Date exportate")]
    public ExportedRecord[] Records { get; set; }
}

public class ExportedRecord
{
    public string Id { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
}

public class IntegrationService
{
    private readonly IXmlGenerator _xmlGenerator;
    private readonly IFileService _fileService;
    
    public async Task<string> ExportDataForIntegration(
        List<ExportedRecord> records)
    {
        var integrationData = new IntegrationData
        {
            SystemId = "FOD-EXPORT",
            ApiVersion = "2.0",
            Timestamp = DateTime.UtcNow,
            Records = records.ToArray()
        };
        
        var xml = _xmlGenerator.Generate(integrationData);
        
        // Salvare în fișier pentru transfer
        var fileName = $"export_{DateTime.Now:yyyyMMdd_HHmmss}.xml";
        await _fileService.SaveXmlFile(fileName, xml);
        
        return fileName;
    }
}
```

### 7. Generare documente complexe

```csharp
public class ComplexDocument
{
    [XmlDescription(Value = "Antet document")]
    public DocumentHeader Header { get; set; }
    
    [XmlDescription(Value = "Corp document")]
    public DocumentBody Body { get; set; }
    
    [XmlDescription(Value = "Semnături")]
    public string[] Signatures { get; set; }
}

public class DocumentHeader
{
    public string DocumentType { get; set; }
    public string DocumentNumber { get; set; }
    public DateTime IssueDate { get; set; }
}

public class DocumentBody
{
    public string Content { get; set; }
    public string[] Attachments { get; set; }
}

public class ComplexDocumentService
{
    private readonly IXmlGenerator _xmlGenerator;
    
    public string GenerateComplexXml()
    {
        var document = new ComplexDocument
        {
            Header = new DocumentHeader
            {
                DocumentType = "Certificat",
                DocumentNumber = "CERT-2024-001",
                IssueDate = DateTime.Now
            },
            Body = new DocumentBody
            {
                Content = "Conținutul certificatului...",
                Attachments = new[] { "Anexa1.pdf", "Anexa2.pdf" }
            },
            Signatures = new[] { "Signature1", "Signature2" }
        };
        
        // Notă: Generatorul actual nu suportă serializare recursivă
        // Pentru obiecte complexe, considerați serializare manuală
        var headerXml = _xmlGenerator.Generate(document.Header);
        var bodyXml = _xmlGenerator.Generate(document.Body);
        
        // Sau folosiți un wrapper plat
        var flatDocument = new
        {
            DocumentType = document.Header.DocumentType,
            DocumentNumber = document.Header.DocumentNumber,
            IssueDate = document.Header.IssueDate,
            Content = document.Body.Content,
            Attachments = document.Body.Attachments,
            Signatures = document.Signatures
        };
        
        return _xmlGenerator.Generate(flatDocument);
    }
}
```

### 8. Validare și procesare XML

```csharp
public class XmlProcessingService
{
    private readonly IXmlGenerator _xmlGenerator;
    private readonly IXmlValidator _xmlValidator;
    
    public async Task<ProcessingResult> ProcessAndValidate(object data)
    {
        try
        {
            // Generare XML
            var xml = _xmlGenerator.Generate(data);
            
            // Validare format
            var xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(xml);
            
            // Validare schemă (dacă există)
            if (_xmlValidator != null)
            {
                var validationResult = await _xmlValidator.ValidateAgainstSchema(
                    xml, 
                    "ServiceRequest.xsd"
                );
                
                if (!validationResult.IsValid)
                {
                    return new ProcessingResult
                    {
                        Success = false,
                        Errors = validationResult.Errors
                    };
                }
            }
            
            return new ProcessingResult
            {
                Success = true,
                GeneratedXml = xml,
                CanonicalForm = true
            };
        }
        catch (Exception ex)
        {
            return new ProcessingResult
            {
                Success = false,
                Errors = new[] { $"Eroare la procesare: {ex.Message}" }
            };
        }
    }
}
```

### 9. Salvare și arhivare

```csharp
public class XmlArchiveService
{
    private readonly IXmlGenerator _xmlGenerator;
    private readonly IFileRepository _fileRepository;
    private readonly IHashGenerator _hashGenerator;
    
    public async Task<ArchiveResult> ArchiveAsXml<T>(
        T document, 
        string category)
    {
        // Generare XML
        var xml = _xmlGenerator.Generate(document);
        
        // Generare hash pentru verificare integritate
        var hashBytes = await _hashGenerator.GetSha1(xml);
        var hash = Convert.ToBase64String(hashBytes);
        
        // Salvare în repository
        var file = new ArchivedFile
        {
            FileName = $"{category}_{DateTime.Now:yyyyMMdd_HHmmss}.xml",
            Content = xml,
            ContentType = "application/xml",
            Category = category,
            Hash = hash,
            CreatedAt = DateTime.UtcNow
        };
        
        var fileId = await _fileRepository.SaveFile(file);
        
        return new ArchiveResult
        {
            FileId = fileId,
            FileName = file.FileName,
            Hash = hash,
            Size = Encoding.UTF8.GetByteCount(xml)
        };
    }
}
```

### 10. Transformare și export

```csharp
public class XmlTransformService
{
    private readonly IXmlGenerator _xmlGenerator;
    
    public async Task<string> TransformToHtml(object data, string xsltPath)
    {
        // Generare XML
        var xml = _xmlGenerator.Generate(data);
        
        // Aplicare transformare XSLT
        var xslt = new XslCompiledTransform();
        xslt.Load(xsltPath);
        
        using (var xmlReader = XmlReader.Create(new StringReader(xml)))
        using (var stringWriter = new StringWriter())
        using (var xmlWriter = XmlWriter.Create(stringWriter))
        {
            xslt.Transform(xmlReader, xmlWriter);
            return stringWriter.ToString();
        }
    }
    
    public string AddXmlDeclaration(object data)
    {
        var xml = _xmlGenerator.Generate(data);
        
        // Adaugă declarația XML dacă lipsește
        if (!xml.StartsWith("<?xml"))
        {
            xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml;
        }
        
        return xml;
    }
}
```

### 11. Testing

```csharp
[TestClass]
public class XmlGeneratorTests
{
    private IXmlGenerator _xmlGenerator;
    
    [TestInitialize]
    public void Setup()
    {
        _xmlGenerator = new XmlGenerator();
    }
    
    [TestMethod]
    public void Generate_SimpleObject_CreatesValidXml()
    {
        // Arrange
        var testObject = new
        {
            Name = "Test",
            Value = 123,
            Date = new DateTime(2024, 6, 30)
        };
        
        // Act
        var xml = _xmlGenerator.Generate(testObject);
        
        // Assert
        Assert.IsNotNull(xml);
        Assert.IsTrue(xml.Contains("<Name>Test</Name>"));
        Assert.IsTrue(xml.Contains("<Value>123</Value>"));
        
        // Verificare XML valid
        var doc = new XmlDocument();
        Assert.DoesNotThrow(() => doc.LoadXml(xml));
    }
    
    [TestMethod]
    public void Generate_WithXmlDescription_AddsAttributes()
    {
        // Arrange
        var testObject = new TestModel
        {
            Property1 = "Value1"
        };
        
        // Act
        var xml = _xmlGenerator.Generate(testObject);
        
        // Assert
        Assert.IsTrue(xml.Contains("Title=\"Test Description\""));
    }
    
    private class TestModel
    {
        [XmlDescription(Value = "Test Description")]
        public string Property1 { get; set; }
    }
}
```

### 12. Limitări cunoscute

1. **Serializare superficială**: Nu serializează recursiv obiecte complexe imbricate
2. **Tipuri limitate**: Suport special doar pentru string[]
3. **Performanță**: Pentru volume mari, considerați serializare streaming
4. **Atribute XML**: Suport limitat la atributul Title prin XmlDescription

### 13. Alternative și extensii

```csharp
public interface IAdvancedXmlGenerator : IXmlGenerator
{
    string Generate(object document, XmlGeneratorOptions options);
}

public class XmlGeneratorOptions
{
    public bool IncludeXmlDeclaration { get; set; } = true;
    public bool IndentOutput { get; set; } = true;
    public string RootNamespace { get; set; }
    public Dictionary<string, string> Namespaces { get; set; }
    public bool IncludeNullValues { get; set; } = false;
}

// Pentru serializare complexă, considerați XmlSerializer standard:
public class StandardXmlService
{
    public string SerializeToXml<T>(T obj)
    {
        var serializer = new XmlSerializer(typeof(T));
        using (var stringWriter = new StringWriter())
        {
            serializer.Serialize(stringWriter, obj);
            return stringWriter.ToString();
        }
    }
}
```

### 14. Best Practices

1. **Modele simple**: Folosiți pentru obiecte plate, nu pentru ierarhii complexe
2. **Validare**: Întotdeauna validați XML-ul generat
3. **Encoding**: Asigurați-vă că datele de intrare sunt compatibile UTF-8
4. **Canonicalizare**: Util pentru semnături digitale și comparații
5. **Documentare**: Folosiți XmlDescription pentru claritate
6. **Performanță**: Pentru volume mari, considerați generare asincronă

### 15. Concluzie

`XmlGenerator` oferă o soluție simplă pentru generarea de documente XML canonicalizate în aplicațiile FOD. Cu suport pentru atribute descriptive și formatare automată, serviciul este ideal pentru generarea de documente standardizate necesare în comunicarea cu sistemele guvernamentale. Pentru scenarii complexe, considerați utilizarea XmlSerializer standard sau biblioteci specializate.