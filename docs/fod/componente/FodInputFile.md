# InputFile

## Documentație pentru componentele FodInputFile și FodSingleFileUploader

### 1. Descriere Generală
Sistemul de încărcare fișiere FOD Components oferă două componente principale pentru gestionarea upload-urilor:
- `FodInputFile` - Componentă generală pentru încărcare fișiere (single/multiple)
- `FodSingleFileUploader` - Componentă specializată pentru un singur fișier cu integrare în formulare

Caracteristici principale:
- Încărcare fișiere single sau multiple
- Restricții tip și dimensiune fișiere
- Previzualizare fișiere încărcate
- Ștergere fișiere cu confirmare
- Validare client și server
- Integrare completă cu formulare Blazor
- Indicatori progres încărcare
- Suport pentru fișiere până la 120MB
- Personalizare completă aspect

### 2. Ghid de Utilizare API

#### Încărcare fișier simplu
```razor
<FodInputFile ID="@Guid.NewGuid().ToString()" 
              Lable="Încarcă fișier"
              Accept=".pdf,.doc,.docx"
              FileSizeMB="10"
              OnChange="@HandleFileUploaded"
              IsError="@HandleUploadError" />

@code {
    private async Task HandleFileUploaded(List<FileUploadResponseModel> files)
    {
        foreach (var file in files)
        {
            Console.WriteLine($"Fișier încărcat: {file.FileName}");
        }
    }
    
    private async Task HandleUploadError(bool hasError)
    {
        if (hasError)
        {
            // Afișează mesaj eroare
            await NotificationService.ShowError("Eroare la încărcarea fișierului");
        }
    }
}
```

#### Încărcare fișiere multiple
```razor
<FodInputFile ID="@Guid.NewGuid().ToString()"
              Multiple="true"
              Lable="Încarcă fișiere"
              Accept="image/*"
              FileSizeMB="5"
              StartIcon="@FodIcons.Material.Filled.CloudUpload"
              Color="FodColor.Primary"
              Variant="FodVariant.Filled"
              OnChange="@HandleMultipleFiles" />

@code {
    private List<FileUploadResponseModel> uploadedFiles = new();
    
    private async Task HandleMultipleFiles(List<FileUploadResponseModel> files)
    {
        uploadedFiles.AddRange(files);
        StateHasChanged();
    }
}
```

#### FodSingleFileUploader în formular
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    
    <FodSingleFileUploader @bind-Value="model.Document"
                          ButtonText="Selectează document"
                          Accept=".pdf"
                          FileSizeMB="20"
                          For="@(() => model.Document)"
                          ShowValidationMessage="true" />
    
    <ValidationMessage For="@(() => model.Document)" />
    
    <FodButton Type="submit" Variant="FodVariant.Filled" Color="FodColor.Primary">
        Trimite
    </FodButton>
</EditForm>

@code {
    public class DocumentModel
    {
        [Required(ErrorMessage = "Documentul este obligatoriu")]
        public FodUploadedFileModel Document { get; set; }
    }
    
    private DocumentModel model = new();
    
    private async Task HandleSubmit()
    {
        // Procesare formular cu document
    }
}
```

#### Încărcare cu previzualizare
```razor
<FodSingleFileUploader @bind-Value="uploadedFile"
                      ButtonText="Încarcă imagine"
                      Accept="image/*"
                      FileSizeMB="5"
                      FileUploadSuccess="@ShowPreview" />

@if (uploadedFile != null)
{
    <div class="mt-3">
        <FodCard>
            <FodCardContent>
                <img src="@uploadedFile.FileUrl" alt="@uploadedFile.FileName" 
                     style="max-width: 100%; height: auto;" />
                <FodText Class="mt-2">@uploadedFile.FileName</FodText>
            </FodCardContent>
        </FodCard>
    </div>
}

@code {
    private FodUploadedFileModel uploadedFile;
    
    private void ShowPreview()
    {
        StateHasChanged();
    }
}
```

#### Mod vizualizare (readonly)
```razor
<FodSingleFileUploader Value="existingFile"
                      ViewOnly="true"
                      ButtonText="Vizualizează document" />

@code {
    private FodUploadedFileModel existingFile = new()
    {
        Id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000"),
        FileName = "Contract_2024.pdf",
        FileType = "application/pdf"
    };
}
```

#### Listă fișiere încărcate cu acțiuni
```razor
<FileList Model="uploadedFiles"
          ColorDelete="FodColor.Error"
          ColorDownload="FodColor.Success"
          ColorView="FodColor.Info"
          OnDelete="@HandleFileDelete"
          OnDownload="@HandleFileDownload"
          OnView="@HandleFileView" />

@code {
    private List<FodUploadedFileModel> uploadedFiles = new();
    
    private async Task HandleFileDelete(FodUploadedFileModel file)
    {
        uploadedFiles.Remove(file);
        await FileUploadService.DeleteFile(file.Id.Value);
    }
    
    private async Task HandleFileDownload(FodUploadedFileModel file)
    {
        await FileUploadService.DownloadFile(file.Id.Value, file.FileType);
    }
    
    private async Task HandleFileView(FodUploadedFileModel file)
    {
        // Deschide previzualizare
    }
}
```

#### Încărcare cu validare personalizată
```razor
<FodSingleFileUploader @bind-Value="model.Certificate"
                      ButtonText="Încarcă certificat"
                      Accept=".pdf,.jpg,.png"
                      FileSizeMB="2"
                      DeleteFileHandler="@CustomDeleteHandler"
                      SizeTooBig="@HandleSizeError" />

@code {
    private async Task<bool> CustomDeleteHandler(Guid fileId)
    {
        // Validare personalizată înainte de ștergere
        var canDelete = await CheckIfCanDelete(fileId);
        if (!canDelete)
        {
            await NotificationService.ShowError("Nu puteți șterge acest fișier");
            return false;
        }
        
        return await FileUploadService.DeleteFile(fileId);
    }
    
    private void HandleSizeError()
    {
        NotificationService.ShowError("Fișierul depășește limita de 2MB");
    }
}
```

#### Încărcare cu stilizare personalizată
```razor
<FodInputFile ID="upload-photos"
              Multiple="true"
              Lable="Adaugă fotografii"
              Accept="image/*"
              FileSizeMB="10"
              Color="FodColor.Secondary"
              Variant="FodVariant.Outlined"
              Size="Size.Large"
              StartIcon="@FodIcons.Material.Filled.PhotoCamera"
              EndIcon="@FodIcons.Material.Filled.Add"
              OnChange="@HandlePhotosUploaded"
              Class="custom-upload-button" />

<style>
    .custom-upload-button {
        border-style: dashed !important;
        border-width: 2px !important;
    }
</style>
```

#### Încărcare documente cu tipuri specifice
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6" Class="mb-3">Documente necesare</FodText>
        
        <div class="d-flex flex-column gap-3">
            <FodSingleFileUploader @bind-Value="documents.IdCard"
                                  ButtonText="Buletin/Pașaport"
                                  Accept=".pdf,.jpg,.png"
                                  FileSizeMB="5" />
            
            <FodSingleFileUploader @bind-Value="documents.ProofOfAddress"
                                  ButtonText="Dovadă adresă"
                                  Accept=".pdf"
                                  FileSizeMB="10" />
            
            <FodSingleFileUploader @bind-Value="documents.IncomeCertificate"
                                  ButtonText="Adeverință venit"
                                  Accept=".pdf"
                                  FileSizeMB="5" />
        </div>
    </FodCardContent>
</FodCard>

@code {
    private DocumentsModel documents = new();
    
    public class DocumentsModel
    {
        public FodUploadedFileModel IdCard { get; set; }
        public FodUploadedFileModel ProofOfAddress { get; set; }
        public FodUploadedFileModel IncomeCertificate { get; set; }
    }
}
```

#### Încărcare cu progres și anulare
```razor
<FodInputFile ID="large-file-upload"
              Lable="@GetUploadButtonText()"
              Accept=".zip,.rar"
              FileSizeMB="100"
              Disable="@isUploading"
              OnChange="@HandleLargeFileUpload"
              StartIcon="@GetUploadIcon()" />

@if (isUploading)
{
    <FodProgress Value="@uploadProgress" Class="mt-2" />
    <FodButton OnClick="CancelUpload" Color="FodColor.Error" Size="Size.Small">
        Anulează
    </FodButton>
}

@code {
    private bool isUploading = false;
    private int uploadProgress = 0;
    
    private string GetUploadButtonText() => isUploading ? "Se încarcă..." : "Încarcă arhivă";
    private string GetUploadIcon() => isUploading ? FodIcons.Material.Filled.HourglassEmpty : FodIcons.Material.Filled.CloudUpload;
    
    private async Task HandleLargeFileUpload(List<FileUploadResponseModel> files)
    {
        isUploading = true;
        // Simulare progres
        for (int i = 0; i <= 100; i += 10)
        {
            uploadProgress = i;
            StateHasChanged();
            await Task.Delay(500);
        }
        isUploading = false;
    }
}
```

### 3. Atribute disponibile

#### FodInputFile
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `ID` | `string` | ID unic pentru componentă | - |
| `Multiple` | `bool` | Permite selecție multiplă | `false` |
| `Accept` | `string` | Tipuri fișiere acceptate | `null` |
| `FileSizeMB` | `double` | Dimensiune maximă în MB | `120` |
| `Lable` | `string` | Text buton | `"Upload"` |
| `Color` | `FodColor` | Culoarea butonului | `Default` |
| `Variant` | `FodVariant` | Stilul butonului | `Text` |
| `Size` | `Size` | Dimensiunea componentei | `Medium` |
| `StartIcon` | `string` | Pictogramă început | `null` |
| `EndIcon` | `string` | Pictogramă sfârșit | `null` |
| `Disable` | `bool` | Dezactivează componenta | `false` |
| `OnChange` | `EventCallback<List<FileUploadResponseModel>>` | Callback succes | - |
| `IsError` | `EventCallback<bool>` | Callback eroare | - |

#### FodSingleFileUploader
| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `Value` | `FodUploadedFileModel` | Fișierul încărcat | `null` |
| `ValueChanged` | `EventCallback<FodUploadedFileModel>` | Eveniment schimbare | - |
| `ViewOnly` | `bool` | Mod doar vizualizare | `false` |
| `ButtonText` | `string` | Text personalizat buton | `"Upload"` |
| `ShowValidationMessage` | `bool` | Afișează mesaje validare | `true` |
| `IgnoreValidation` | `bool` | Ignoră validarea | `false` |
| `FileSizeMB` | `double` | Dimensiune maximă în MB | `40` |
| `DeleteFileHandler` | `Func<Guid, Task<bool>>` | Handler ștergere custom | `null` |
| `FileUploadSuccess` | `EventCallback` | Callback succes upload | - |
| `SizeTooBig` | `EventCallback` | Callback depășire dimensiune | - |
| Plus toate proprietățile de la FodInputFile |

### 4. Modele de date

#### FodUploadedFileModel
```csharp
public class FodUploadedFileModel
{
    public Guid? Id { get; set; }
    public string? FileType { get; set; }
    public string? FileName { get; set; }
    public string? FileUrl { get; set; }
}
```

#### FileUploadResponseModel
```csharp
public class FileUploadResponseModel
{
    public Guid? Id { get; set; }
    public string? FileName { get; set; }
    public string FileType { get; set; }
    public FileUploadValidateResult? ValidateResult { get; set; }
}
```

### 5. Servicii asociate

#### IFileUploadService
```csharp
// Injectare
@inject IFileUploadService FileUploadService

// Metode disponibile
await FileUploadService.UploadFile(fileRequest);
await FileUploadService.DownloadFile(fileId, contentType);
await FileUploadService.DeleteFile(fileId);
await FileUploadService.GetFileUrl(fileId);
```

#### ISingleFileUploadService
```csharp
// Injectare
@inject ISingleFileUploadService SingleFileUploadService

// Metode disponibile
await SingleFileUploadService.UploadSingleFile(fileRequest);
await SingleFileUploadService.DeleteFile(fileId);
```

### 6. Validare fișiere

#### Validare pe client
- Verificare tip fișier (Accept parameter)
- Verificare dimensiune maximă
- Feedback instant utilizator

#### Validare pe server
```csharp
public class CustomFileValidator : IFileUploadValidator
{
    public FileUploadValidateResult Validate(FileUploaRequestdModel file)
    {
        var result = new FileUploadValidateResult();
        
        // Validare tip fișier
        var allowedTypes = new[] { "application/pdf", "image/jpeg", "image/png" };
        if (!allowedTypes.Contains(file.FileType))
        {
            result.AddError("Tip fișier neacceptat");
        }
        
        // Validare conținut
        if (file.FileContent?.Content == null || file.FileContent.Content.Length == 0)
        {
            result.AddError("Fișierul este gol");
        }
        
        return result;
    }
}
```

### 7. Stilizare și personalizare

```css
/* Buton upload personalizat */
.custom-upload-zone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    transition: all 0.3s ease;
}

.custom-upload-zone:hover {
    border-color: var(--fod-primary);
    background-color: rgba(var(--fod-primary-rgb), 0.05);
}

/* Listă fișiere stilizată */
.file-list-custom {
    max-height: 300px;
    overflow-y: auto;
}

.file-list-custom .file-item {
    padding: 12px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Indicatori tip fișier */
.file-type-pdf { color: #d32f2f; }
.file-type-doc { color: #1976d2; }
.file-type-image { color: #388e3c; }
```

### 8. Integrare cu alte componente

#### În Wizard pentru proces pas cu pas
```razor
<FodWizard>
    <FodWizardStep Title="Date personale">
        <!-- Formular date -->
    </FodWizardStep>
    
    <FodWizardStep Title="Documente">
        <FodSingleFileUploader @bind-Value="model.Document1"
                              ButtonText="Document identitate"
                              Required="true" />
        
        <FodSingleFileUploader @bind-Value="model.Document2"
                              ButtonText="Dovadă venit"
                              Required="true" />
    </FodWizardStep>
    
    <FodWizardStep Title="Confirmare">
        <!-- Rezumat cu previzualizare documente -->
    </FodWizardStep>
</FodWizard>
```

### 9. Gestionare erori

```razor
<FodInputFile ID="safe-upload"
              Lable="Încarcă fișier"
              OnChange="@HandleFileUpload"
              IsError="@HandleError" />

@if (!string.IsNullOrEmpty(errorMessage))
{
    <FodAlert Severity="FodSeverity.Error" Class="mt-2">
        @errorMessage
    </FodAlert>
}

@code {
    private string errorMessage = "";
    
    private async Task HandleError(bool hasError)
    {
        if (hasError)
        {
            errorMessage = "Eroare la încărcare. Verificați tipul și dimensiunea fișierului.";
        }
    }
    
    private async Task HandleFileUpload(List<FileUploadResponseModel> files)
    {
        errorMessage = "";
        foreach (var file in files)
        {
            if (file.ValidateResult?.Success == false)
            {
                errorMessage = string.Join(", ", file.ValidateResult.ErrorMessages);
                break;
            }
        }
    }
}
```

### 10. Note și observații

- Limita maximă hardcoded: 120MB pentru FodInputFile
- Fișierele sunt stocate în baza de date (tabela FileContent)
- Previzualizarea folosește iframe pentru non-imagini
- Validarea pe server este obligatorie pentru securitate
- Component ID trebuie să fie unic pe pagină

### 11. Securitate

1. **Validare tip fișier** - Verificați pe server, nu doar client
2. **Scanare antivirus** - Integrați scanare pentru fișiere încărcate
3. **Limitare dimensiune** - Preveniți DoS prin upload-uri mari
4. **Verificare conținut** - Validați că tipul MIME corespunde conținutului
5. **Permisiuni** - Verificați drepturile utilizatorului

### 12. Performanță

1. **Încărcare asincronă** - Nu blocați UI-ul
2. **Progres vizual** - Afișați indicatori pentru fișiere mari
3. **Compresie imagini** - Reduceți dimensiunea înainte de upload
4. **Lazy loading** - Pentru liste mari de fișiere
5. **Chunk upload** - Pentru fișiere foarte mari

### 13. Bune practici

1. **Feedback clar** - Informați utilizatorul despre progres și erori
2. **Tipuri explicite** - Specificați clar ce fișiere sunt acceptate
3. **Limite rezonabile** - Setați dimensiuni maxime adecvate
4. **Previzualizare** - Permiteți verificarea înainte de trimitere
5. **Ștergere sigură** - Confirmați înainte de ștergere permanentă
6. **Validare dublă** - Client și server pentru siguranță

### 14. Troubleshooting

#### Upload-ul nu funcționează
- Verificați că serviciile sunt înregistrate în DI
- Verificați endpoint-urile API
- Verificați permisiunile CORS

#### Fișierul nu se afișează
- Verificați că FileUrl este completat
- Verificați tipul MIME pentru previzualizare

#### Eroare de dimensiune
- Verificați FileSizeMB pe componentă
- Verificați limita pe server (120MB max)

### 15. Concluzie
Sistemul de încărcare fișiere FOD Components oferă o soluție completă și flexibilă pentru gestionarea fișierelor în aplicații Blazor, cu suport pentru validare, previzualizare și integrare perfectă în formulare.