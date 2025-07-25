# SingleFileUploadService

## Descriere Generală

`SingleFileUploadService` este o versiune simplificată a serviciului de upload fișiere, optimizată pentru gestionarea unui singur fișier. Este ideală pentru scenarii unde utilizatorul poate încărca doar un fișier la un moment dat, cum ar fi fotografia de profil, un document principal sau un attachment unic.

## Configurare

### Înregistrare în Dependency Injection

```csharp
// În Program.cs sau Startup.cs
builder.Services.AddHttpClient<ISingleFileUploadService, SingleFileUploadService>(client =>
{
    client.BaseAddress = new Uri(Configuration["ApiBaseUrl"]);
});

// Cu timeout personalizat pentru fișiere mari
builder.Services.AddHttpClient<ISingleFileUploadService, SingleFileUploadService>(client =>
{
    client.BaseAddress = new Uri(Configuration["ApiBaseUrl"]);
    client.Timeout = TimeSpan.FromMinutes(5);
});
```

### Configurare cu Polly pentru resilience

```csharp
builder.Services.AddHttpClient<ISingleFileUploadService, SingleFileUploadService>()
    .AddPolicyHandler(HttpPolicyExtensions
        .HandleTransientHttpError()
        .OrResult(msg => !msg.IsSuccessStatusCode)
        .WaitAndRetryAsync(
            3,
            retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))));
```

## Interfața ISingleFileUploadService

```csharp
public interface ISingleFileUploadService
{
    Task<SingleFileUploadResponse> UploadSingleFile(FileUploaRequestdModel file);
    Task<bool> DeleteFile(Guid FileId);
}
```

## Metode disponibile

### UploadSingleFile

Încarcă un singur fișier pe server.

**Parametri:**
- `file: FileUploaRequestdModel` - Modelul cu datele fișierului de încărcat

**Returnează:** `Task<SingleFileUploadResponse>` - Răspunsul cu detaliile fișierului încărcat

**Endpoint:** `POST api/fod/single-file-upload`

### DeleteFile

Șterge un fișier de pe server.

**Parametri:**
- `FileId: Guid` - ID-ul unic al fișierului de șters

**Returnează:** `Task<bool>` - True dacă ștergerea a reușit, False altfel

**Endpoint:** `DELETE api/fod/single-file-delete/{FileId}`

## Exemple de utilizare

### Upload fișier simplu

```razor
@inject ISingleFileUploadService FileUploadService

<div class="file-upload-container">
    <InputFile OnChange="@UploadFile" accept=".pdf,.jpg,.png" />
    
    @if (isUploading)
    {
        <FodLoadingCircular />
    }
    
    @if (uploadedFile != null)
    {
        <div class="uploaded-file">
            <FodIcon Icon="@FodIcons.Material.Filled.Description" />
            <span>@uploadedFile.FileName</span>
            <FodIconButton Icon="@FodIcons.Material.Filled.Close"
                          OnClick="@DeleteFile" />
        </div>
    }
</div>

@code {
    private SingleFileUploadResponse uploadedFile;
    private bool isUploading;

    private async Task UploadFile(InputFileChangeEventArgs e)
    {
        isUploading = true;
        
        try
        {
            var file = e.File;
            using var stream = file.OpenReadStream(maxAllowedSize: 10 * 1024 * 1024); // 10MB
            var buffer = new byte[file.Size];
            await stream.ReadAsync(buffer);

            var request = new FileUploaRequestdModel
            {
                FileName = file.Name,
                FileContent = buffer,
                ContentType = file.ContentType,
                Size = file.Size
            };

            uploadedFile = await FileUploadService.UploadSingleFile(request);
        }
        catch (Exception ex)
        {
            // Handle error
            Console.WriteLine($"Eroare upload: {ex.Message}");
        }
        finally
        {
            isUploading = false;
        }
    }

    private async Task DeleteFile()
    {
        if (uploadedFile != null)
        {
            var success = await FileUploadService.DeleteFile(uploadedFile.Id);
            if (success)
            {
                uploadedFile = null;
            }
        }
    }
}
```

### Component pentru imagine profil

```razor
@inject ISingleFileUploadService FileUploadService
@inject IJSRuntime JS

<div class="profile-image-upload">
    <div class="image-container">
        @if (!string.IsNullOrEmpty(imageUrl))
        {
            <img src="@imageUrl" alt="Profile" />
        }
        else
        {
            <FodIcon Icon="@FodIcons.Material.Filled.AccountCircle" 
                    Size="FodSize.ExtraLarge" />
        }
    </div>
    
    <FodButton OnClick="@TriggerFileInput">
        Schimbă Imaginea
    </FodButton>
    
    <InputFile @ref="fileInput" 
               OnChange="@UploadProfileImage" 
               accept="image/*" 
               style="display: none;" />
</div>

@code {
    [Parameter] public Guid? CurrentImageId { get; set; }
    [Parameter] public EventCallback<SingleFileUploadResponse> OnImageUploaded { get; set; }
    
    private InputFile fileInput;
    private string imageUrl;

    protected override void OnParametersSet()
    {
        if (CurrentImageId.HasValue)
        {
            imageUrl = $"/api/files/{CurrentImageId}";
        }
    }

    private async Task TriggerFileInput()
    {
        await JS.InvokeVoidAsync("triggerClick", fileInput.Element);
    }

    private async Task UploadProfileImage(InputFileChangeEventArgs e)
    {
        var imageFile = e.File;
        
        // Validare tip imagine
        if (!imageFile.ContentType.StartsWith("image/"))
        {
            // Show error
            return;
        }

        // Conversie la byte array
        using var stream = imageFile.OpenReadStream(maxAllowedSize: 5 * 1024 * 1024); // 5MB
        using var ms = new MemoryStream();
        await stream.CopyToAsync(ms);
        
        var request = new FileUploaRequestdModel
        {
            FileName = imageFile.Name,
            FileContent = ms.ToArray(),
            ContentType = imageFile.ContentType,
            Size = imageFile.Size
        };

        // Șterge imaginea veche dacă există
        if (CurrentImageId.HasValue)
        {
            await FileUploadService.DeleteFile(CurrentImageId.Value);
        }

        // Upload imagine nouă
        var response = await FileUploadService.UploadSingleFile(request);
        imageUrl = $"/api/files/{response.Id}";
        
        await OnImageUploaded.InvokeAsync(response);
    }
}
```

### Formular cu document atașat

```razor
@inject ISingleFileUploadService FileUploadService

<EditForm Model="@formModel" OnValidSubmit="@SubmitForm">
    <DataAnnotationsValidator />
    
    <div class="form-group">
        <label>Nume</label>
        <InputText @bind-Value="formModel.Name" class="form-control" />
        <ValidationMessage For="@(() => formModel.Name)" />
    </div>

    <div class="form-group">
        <label>Document suport</label>
        @if (attachedFile == null)
        {
            <InputFile OnChange="@AttachDocument" />
        }
        else
        {
            <div class="attached-file">
                <span>@attachedFile.FileName</span>
                <FodButton Size="FodSize.Small" 
                          Color="FodColor.Error"
                          OnClick="@RemoveDocument">
                    Elimină
                </FodButton>
            </div>
        }
        <ValidationMessage For="@(() => formModel.DocumentId)" />
    </div>

    <FodButton Type="submit" Color="FodColor.Primary">
        Trimite
    </FodButton>
</EditForm>

@code {
    private FormModel formModel = new();
    private SingleFileUploadResponse attachedFile;

    private async Task AttachDocument(InputFileChangeEventArgs e)
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

        attachedFile = await FileUploadService.UploadSingleFile(request);
        formModel.DocumentId = attachedFile.Id;
    }

    private async Task RemoveDocument()
    {
        if (attachedFile != null)
        {
            await FileUploadService.DeleteFile(attachedFile.Id);
            attachedFile = null;
            formModel.DocumentId = null;
        }
    }

    private async Task SubmitForm()
    {
        // Submit form logic
    }

    private class FormModel
    {
        [Required]
        public string Name { get; set; }
        
        [Required]
        public Guid? DocumentId { get; set; }
    }
}
```

## Diferențe față de FileUploadService

| Aspect | SingleFileUploadService | FileUploadService |
|--------|------------------------|-------------------|
| Scop | Un singur fișier | Multiple fișiere |
| Metode | 2 (upload, delete) | 7 (CRUD complet) |
| Complexitate | Simplă | Moderată |
| Use case | Profil, document unic | Galerii, atașamente multiple |
| Endpoints | `/single-file-*` | `/file-*` |

## Tratare erori

### Service wrapper cu logging

```csharp
public class LoggingSingleFileUploadService : ISingleFileUploadService
{
    private readonly SingleFileUploadService _innerService;
    private readonly ILogger<LoggingSingleFileUploadService> _logger;

    public async Task<SingleFileUploadResponse> UploadSingleFile(FileUploaRequestdModel file)
    {
        _logger.LogInformation("Încărcare fișier: {FileName}, Size: {Size}", 
            file.FileName, file.Size);
        
        try
        {
            var result = await _innerService.UploadSingleFile(file);
            _logger.LogInformation("Fișier încărcat cu succes: {FileId}", result.Id);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Eroare la încărcarea fișierului {FileName}", 
                file.FileName);
            throw;
        }
    }
}
```

## Note tehnice

1. **Simplicitate** - API minimal pentru use case-uri simple
2. **No batch operations** - Nu suportă operații pe mai multe fișiere
3. **Same request model** - Folosește același model ca FileUploadService
4. **Different endpoints** - Endpoints separate pentru izolare
5. **No download method** - Focusat doar pe upload/delete

## Bune practici

1. **Validare tip fișier** - Verificați extensia și MIME type
2. **Limitare dimensiune** - Impuneți limite de dimensiune
3. **Cleanup** - Ștergeți fișierele vechi la înlocuire
4. **Error handling** - Gestionați erorile de rețea graceful
5. **Loading states** - Afișați indicatori de progres
6. **Confirmation** - Cereți confirmare înainte de ștergere

## Concluzie

SingleFileUploadService oferă o interfață simplificată pentru scenarii comune de upload unde este necesar un singur fișier. Cu doar două metode esențiale și o abordare focusată, serviciul este ideal pentru funcționalități precum fotografii de profil, documente principale sau atașamente unice în formulare.