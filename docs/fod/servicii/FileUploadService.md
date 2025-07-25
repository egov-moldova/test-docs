# FileUploadService

## Descriere Generală

`FileUploadService` este serviciul principal pentru gestionarea operațiunilor cu fișiere în aplicație. Oferă funcționalități complete pentru încărcare, descărcare, ștergere și vizualizare fișiere, comunicând cu API-ul backend pentru toate operațiunile.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddHttpClient<IFileUploadService, FileUploadServices>(client =>
{
    client.BaseAddress = new Uri(Configuration["ApiBaseUrl"]);
    client.Timeout = TimeSpan.FromMinutes(10);
});

// Cu politici de retry
builder.Services.AddHttpClient<IFileUploadService, FileUploadServices>()
    .AddPolicyHandler(GetRetryPolicy())
    .AddPolicyHandler(GetCircuitBreakerPolicy());
```

### Configurare pentru fișiere mari

```csharp
// Configurare pentru upload fișiere mari
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 209715200; // 200MB
});

builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 209715200; // 200MB
});
```

## Interfața IFileUploadService

```csharp
public interface IFileUploadService
{
    Task<FileUploadResponseModel> UploadFile(FileUploaRequestdModel file);
    Task<byte[]> DownloadFile(Guid FileId, string contentType);
    Task<byte[]> GetFile(Guid FileId, string contentType);
    Task<bool> DeleteFile(Guid FileId);
    Task<IEnumerable<FileUploadResponseModel>> GetFilesById(IEnumerable<FileUploadResponseModel> request);
    Task<FileViewModel> GetFileUrl(Guid id);
    Task<IEnumerable<FileViewModel>> GetFilesUrls(IEnumerable<Guid> ids);
}
```

## Metode disponibile

### UploadFile

Încarcă un fișier pe server.

**Parametri:**
- `file: FileUploaRequestdModel` - Modelul cu datele fișierului

**Returnează:** `Task<FileUploadResponseModel>` - Răspunsul cu detaliile fișierului încărcat

**Endpoint:** `POST api/fod/file-upload`

### DownloadFile

Descarcă un fișier de pe server.

**Parametri:**
- `FileId: Guid` - ID-ul fișierului
- `contentType: string` - Tipul MIME al fișierului

**Returnează:** `Task<byte[]>` - Conținutul fișierului ca array de bytes

**Endpoint:** `GET api/fod/file-download/{FileId}/{contentType}`

### GetFile

Obține conținutul unui fișier (similar cu DownloadFile).

**Parametri:**
- `FileId: Guid` - ID-ul fișierului
- `contentType: string` - Tipul MIME al fișierului

**Returnează:** `Task<byte[]>` - Conținutul fișierului

**Endpoint:** `GET api/fod/file-get-url/{FileId}/{contentType}`

### DeleteFile

Șterge un fișier de pe server.

**Parametri:**
- `FileId: Guid` - ID-ul fișierului de șters

**Returnează:** `Task<bool>` - True dacă ștergerea a reușit

**Endpoint:** `DELETE api/fod/file-delete/{FileId}`

### GetFilesById

Obține detaliile mai multor fișiere.

**Parametri:**
- `request: IEnumerable<FileUploadResponseModel>` - Lista cu modele de fișiere

**Returnează:** `Task<IEnumerable<FileUploadResponseModel>>` - Detaliile fișierelor

**Endpoint:** `POST api/fod/file-getAll`

### GetFileUrl

Obține URL-ul pentru vizualizarea unui fișier.

**Parametri:**
- `id: Guid` - ID-ul fișierului

**Returnează:** `Task<FileViewModel>` - Model cu URL și detalii fișier

**Endpoint:** `GET api/fod/file-view/{id}`

### GetFilesUrls

Obține URL-urile pentru mai multe fișiere.

**Parametri:**
- `ids: IEnumerable<Guid>` - Lista de ID-uri

**Returnează:** `Task<IEnumerable<FileViewModel>>` - Lista de modele cu URL-uri

**Endpoint:** `POST api/fod/file-view-all`

## Exemple de utilizare

### Upload fișier simplu

```razor
@inject IFileUploadService FileUploadService

<InputFile OnChange="@UploadFile" />

@if (uploadedFile != null)
{
    <p>Fișier încărcat: @uploadedFile.FileName</p>
}

@code {
    private FileUploadResponseModel uploadedFile;

    private async Task UploadFile(InputFileChangeEventArgs e)
    {
        var file = e.File;
        var buffer = new byte[file.Size];
        await file.OpenReadStream().ReadAsync(buffer);

        var request = new FileUploaRequestdModel
        {
            FileName = file.Name,
            FileContent = buffer,
            ContentType = file.ContentType,
            Size = file.Size
        };

        uploadedFile = await FileUploadService.UploadFile(request);
    }
}
```

### Download fișier

```razor
@inject IFileUploadService FileUploadService
@inject IJSRuntime JS

<FodButton OnClick="@(() => DownloadFile(fileId))">
    Descarcă Fișier
</FodButton>

@code {
    private Guid fileId = Guid.Parse("...");

    private async Task DownloadFile(Guid id)
    {
        var fileData = await FileUploadService.DownloadFile(id, "application/pdf");
        
        // Trigger download în browser
        await JS.InvokeVoidAsync("downloadFileFromStream", 
            "document.pdf", Convert.ToBase64String(fileData));
    }
}
```

### Gestionare fișiere multiple

```razor
@inject IFileUploadService FileUploadService

<div class="file-manager">
    @foreach (var file in uploadedFiles)
    {
        <div class="file-item">
            <span>@file.FileName</span>
            <FodButton Size="FodSize.Small" 
                      OnClick="@(() => DeleteFile(file.Id))">
                Șterge
            </FodButton>
        </div>
    }
</div>

@code {
    private List<FileUploadResponseModel> uploadedFiles = new();

    private async Task DeleteFile(Guid fileId)
    {
        var success = await FileUploadService.DeleteFile(fileId);
        if (success)
        {
            uploadedFiles.RemoveAll(f => f.Id == fileId);
        }
    }
}
```

### Preview fișiere

```razor
@inject IFileUploadService FileUploadService

@if (fileViewModels.Any())
{
    <div class="file-previews">
        @foreach (var file in fileViewModels)
        {
            <div class="preview-item">
                @if (file.ContentType.StartsWith("image/"))
                {
                    <img src="@file.Url" alt="@file.FileName" />
                }
                else
                {
                    <iframe src="@file.Url" title="@file.FileName"></iframe>
                }
            </div>
        }
    </div>
}

@code {
    private List<FileViewModel> fileViewModels = new();

    protected override async Task OnInitializedAsync()
    {
        var fileIds = new[] { Guid.Parse("..."), Guid.Parse("...") };
        fileViewModels = (await FileUploadService.GetFilesUrls(fileIds)).ToList();
    }
}
```

## Integrare cu componente

### Cu FodInputFile

```razor
<FodInputFile OnChange="@HandleFileUpload"
              Accept=".pdf,.docx"
              MaxFileSize="10485760">
    <ButtonContent>
        <FodButton StartIcon="@FodIcons.Material.Filled.Upload">
            Încarcă Document
        </FodButton>
    </ButtonContent>
</FodInputFile>

@code {
    private async Task HandleFileUpload(FodFileUploadEventArgs args)
    {
        foreach (var file in args.Files)
        {
            var response = await FileUploadService.UploadFile(file.ToRequestModel());
            // Procesare răspuns
        }
    }
}
```

## Tratare erori

### Handler cu retry și logging

```csharp
public class ResilientFileUploadService : IFileUploadService
{
    private readonly FileUploadServices _innerService;
    private readonly ILogger<ResilientFileUploadService> _logger;

    public async Task<FileUploadResponseModel> UploadFile(FileUploaRequestdModel file)
    {
        try
        {
            return await _innerService.UploadFile(file);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Eroare la încărcarea fișierului {FileName}", 
                file.FileName);
            throw new FileUploadException("Încărcarea a eșuat", ex);
        }
        catch (TaskCanceledException)
        {
            _logger.LogWarning("Timeout la încărcarea fișierului {FileName}", 
                file.FileName);
            throw new FileUploadException("Încărcarea a depășit timpul limită");
        }
    }
}
```

### Validare fișiere

```csharp
public class ValidatingFileUploadService : IFileUploadService
{
    private readonly string[] _allowedExtensions = { ".pdf", ".docx", ".xlsx" };
    private readonly long _maxFileSize = 10 * 1024 * 1024; // 10MB

    public async Task<FileUploadResponseModel> UploadFile(FileUploaRequestdModel file)
    {
        // Validare extensie
        var extension = Path.GetExtension(file.FileName);
        if (!_allowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase))
        {
            throw new ValidationException($"Tipul de fișier {extension} nu este permis");
        }

        // Validare dimensiune
        if (file.FileContent.Length > _maxFileSize)
        {
            throw new ValidationException("Fișierul depășește dimensiunea maximă permisă");
        }

        return await _innerService.UploadFile(file);
    }
}
```

## Note tehnice

1. **Timeout configurat** - 10 minute pentru upload-uri mari
2. **HttpClient separat** - Crează client nou pentru upload cu timeout specific
3. **Endpoints RESTful** - Folosește convenții REST standard
4. **Content type required** - Necesită content type pentru download/get
5. **Batch operations** - Suportă operații pe mai multe fișiere

## Bune practici

1. **Validare client-side** - Validați fișierele înainte de upload
2. **Progress indicator** - Afișați progres pentru fișiere mari
3. **Chunk upload** - Pentru fișiere foarte mari, considerați upload în bucăți
4. **Error recovery** - Implementați retry pentru erori de rețea
5. **Memory management** - Evitați încărcarea completă în memorie pentru fișiere mari
6. **Security** - Validați tipurile de fișiere și scanați pentru malware

## Concluzie

FileUploadService oferă o interfață completă pentru gestionarea fișierelor în aplicații Blazor. Cu suport pentru toate operațiunile CRUD și funcționalități avansate precum vizualizare și operații batch, serviciul facilitează implementarea unui sistem robust de management al documentelor.