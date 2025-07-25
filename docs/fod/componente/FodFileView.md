# FodFileView

## Documentație pentru componenta FodFileView

### 1. Descriere Generală

`FodFileView` este o componentă pentru vizualizarea fișierelor într-un modal. Suportă afișarea imaginilor direct și a altor tipuri de fișiere prin iframe, oferind o experiență de previzualizare integrată pentru documentele încărcate.

Caracteristici principale:
- Vizualizare fișiere în modal responsive
- Suport pentru imagini cu scalare automată
- Afișare documente (PDF, etc.) prin iframe
- Loading state pentru încărcare
- Integrare cu IFileUploadService
- API endpoint pentru servirea fișierelor
- Închidere cu ESC

### 2. Utilizare de Bază

#### Vizualizator simplu
```razor
<FodFileView @ref="fileViewer" />

<FodButton OnClick="() => fileViewer.OpenFileViewAsync(fileId)">
    Vizualizează fișier
</FodButton>

@code {
    private FodFileView fileViewer;
    private Guid fileId = Guid.Parse("...");
}
```

#### Integrare cu FileList
```razor
<FileList Model="@uploadedFiles">
    <PreviewButton>
        <FodButton OnClick="() => OpenPreview(context.Id)">
            <FodIcon Icon="@FodIcons.Material.Filled.Preview" />
        </FodButton>
    </PreviewButton>
</FileList>

<FodFileView @ref="fileViewer" 
             OnOpen="HandleFileOpened"
             OnCloase="HandleFileClosed" />

@code {
    private FodFileView fileViewer;
    
    private async Task OpenPreview(Guid fileId)
    {
        await fileViewer.OpenFileViewAsync(fileId);
    }
    
    private void HandleFileOpened()
    {
        Console.WriteLine("File viewer opened");
    }
    
    private void HandleFileClosed()
    {
        Console.WriteLine("File viewer closed");
    }
}
```

### 3. Parametri și Metode

| Parametru/Metodă | Tip | Descriere |
|------------------|-----|-----------|
| `OpenFileViewer` | `bool` | Stare deschidere modal (Parameter) |
| `OnCloase` | `EventCallback` | Eveniment la închidere (typo în original) |
| `OnOpen` | `EventCallback` | Eveniment la deschidere |
| `FileId` | `Guid` | ID-ul fișierului de afișat |
| `OpenFileViewAsync(Guid id)` | `Task` | Metodă publică pentru deschidere |

### 4. Model FileViewModel

```csharp
public class FileViewModel
{
    public Guid Id { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public string ContentType { get; set; }
    public long FileSize { get; set; }
    // alte proprietăți
}
```

### 5. Exemple Avansate

#### Galerie de imagini cu preview
```razor
<div class="image-gallery">
    <FodGrid container spacing="2">
        @foreach (var image in imageFiles)
        {
            <FodGrid item xs="6" sm="4" md="3">
                <div class="gallery-item" @onclick="() => PreviewImage(image.Id)">
                    <img src="@GetThumbnailUrl(image.Id)" 
                         alt="@image.FileName"
                         class="img-thumbnail" />
                    <div class="overlay">
                        <FodIcon Icon="@FodIcons.Material.Filled.ZoomIn" 
                                 Color="FodColor.White" />
                    </div>
                </div>
            </FodGrid>
        }
    </FodGrid>
</div>

<FodFileView @ref="imageViewer" />

@code {
    private FodFileView imageViewer;
    private List<FileInfo> imageFiles;
    
    private async Task PreviewImage(Guid imageId)
    {
        await imageViewer.OpenFileViewAsync(imageId);
    }
    
    private string GetThumbnailUrl(Guid fileId)
    {
        return $"api/fod/file-thumbnail/{fileId}";
    }
}

<style>
    .gallery-item {
        position: relative;
        cursor: pointer;
        overflow: hidden;
        border-radius: 8px;
    }
    
    .gallery-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.3s;
    }
    
    .gallery-item:hover img {
        transform: scale(1.1);
    }
    
    .gallery-item .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .gallery-item:hover .overlay {
        opacity: 1;
    }
</style>
```

#### Viewer cu toolbar acțiuni
```razor
@* ExtendedFileView.razor *@
@inherits FodComponent

<FodModal Show="@Show"
          OnClosed="OnCloseAsync"
          CloseOnEscape="true"
          Scrollable="true"
          Size="FodSize.Large">
    <HeaderTemplate>
        <div class="d-flex justify-content-between align-items-center w-100">
            <FodText Typo="Typo.h6">@fileInfo?.FileName</FodText>
            <div class="file-actions">
                <FodIconButton Icon="@FodIcons.Material.Filled.Download"
                               OnClick="DownloadFile"
                               Title="Descarcă" />
                <FodIconButton Icon="@FodIcons.Material.Filled.Print"
                               OnClick="PrintFile"
                               Title="Printează" />
                <FodIconButton Icon="@FodIcons.Material.Filled.Share"
                               OnClick="ShareFile"
                               Title="Partajează" />
                <FodIconButton Icon="@FodIcons.Material.Filled.Close"
                               OnClick="OnCloseAsync"
                               Title="Închide" />
            </div>
        </div>
    </HeaderTemplate>
    
    <BodyTemplate>
        <FodFileView @ref="baseViewer" FileId="@currentFileId" />
        
        @if (showFileInfo)
        {
            <div class="file-info-panel mt-3">
                <FodText Typo="Typo.subtitle2">Informații fișier</FodText>
                <dl class="row">
                    <dt class="col-sm-3">Nume:</dt>
                    <dd class="col-sm-9">@fileInfo.FileName</dd>
                    
                    <dt class="col-sm-3">Dimensiune:</dt>
                    <dd class="col-sm-9">@FormatFileSize(fileInfo.FileSize)</dd>
                    
                    <dt class="col-sm-3">Tip:</dt>
                    <dd class="col-sm-9">@fileInfo.ContentType</dd>
                    
                    <dt class="col-sm-3">Încărcat la:</dt>
                    <dd class="col-sm-9">@fileInfo.UploadDate.ToString("dd.MM.yyyy HH:mm")</dd>
                </dl>
            </div>
        }
    </BodyTemplate>
</FodModal>

@code {
    private FodFileView baseViewer;
    private FileInfo fileInfo;
    private Guid currentFileId;
    private bool Show;
    private bool showFileInfo;
    
    [Inject] private IJSRuntime JS { get; set; }
    [Inject] private IPrintingService PrintService { get; set; }
    
    public async Task OpenWithInfo(Guid fileId)
    {
        currentFileId = fileId;
        fileInfo = await FileService.GetFileInfo(fileId);
        Show = true;
        await baseViewer.OpenFileViewAsync(fileId);
    }
    
    private async Task DownloadFile()
    {
        var url = $"api/fod/file-download/{currentFileId}";
        await JS.InvokeVoidAsync("open", url, "_blank");
    }
    
    private async Task PrintFile()
    {
        await PrintService.PrintFile(currentFileId);
    }
    
    private async Task ShareFile()
    {
        // Implementare partajare
    }
}
```

### 6. Stilizare și Personalizare

```css
/* Modal customization */
.fod-modal .modal-dialog.modal-lg {
    max-width: 90%;
}

/* Responsive iframe */
.fod-file-view iframe {
    width: 100%;
    height: calc(100vh - 200px);
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Image viewer enhancements */
.fod-file-view .scaled-img {
    cursor: zoom-in;
    transition: transform 0.3s ease;
}

.fod-file-view .scaled-img:hover {
    transform: scale(1.02);
}

/* Loading state */
.fod-file-view-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

/* File type indicators */
.file-type-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.875rem;
}
```

### 7. Integrare cu Servicii

#### Service pentru file viewing
```csharp
public interface IFileViewService
{
    Task<FileViewModel> GetFileViewModel(Guid fileId);
    Task<bool> CanUserViewFile(Guid fileId, string userId);
    Task LogFileView(Guid fileId, string userId);
}

public class FileViewService : IFileViewService
{
    private readonly IFileUploadService _fileService;
    private readonly ILogger<FileViewService> _logger;
    
    public async Task<FileViewModel> GetFileViewModel(Guid fileId)
    {
        var file = await _fileService.GetFileUrl(fileId);
        
        // Adaugă metadata suplimentară
        file.CanPrint = IsPrintable(file.FileType);
        file.CanDownload = await CheckDownloadPermission(fileId);
        
        return file;
    }
    
    private bool IsPrintable(string fileType)
    {
        var printableTypes = new[] { "pdf", "image", "text" };
        return printableTypes.Any(t => fileType.Contains(t));
    }
}
```

### 8. Scenarii de Utilizare

#### Document viewer cu navigare
```razor
<div class="document-viewer-container">
    <div class="document-list">
        <FodList Dense="true" @bind-SelectedValue="selectedDocId">
            @foreach (var doc in documents)
            {
                <FodListItem Value="@doc.Id.ToString()"
                             OnClick="() => ViewDocument(doc.Id)">
                    <FodListItemIcon>
                        <FodIcon Icon="@GetFileIcon(doc.FileType)" />
                    </FodListItemIcon>
                    <FodListItemText>
                        <span>@doc.FileName</span>
                        <small class="text-muted">@doc.FileSize.ToFileSize()</small>
                    </FodListItemText>
                </FodListItem>
            }
        </FodList>
    </div>
    
    <div class="document-preview">
        <FodFileView @ref="docViewer" />
    </div>
</div>

@code {
    private FodFileView docViewer;
    private string selectedDocId;
    private List<Document> documents;
    
    private async Task ViewDocument(Guid docId)
    {
        await docViewer.OpenFileViewAsync(docId);
    }
    
    private string GetFileIcon(string fileType) => fileType switch
    {
        var t when t.Contains("pdf") => FodIcons.Material.Filled.PictureAsPdf,
        var t when t.Contains("image") => FodIcons.Material.Filled.Image,
        var t when t.Contains("word") => FodIcons.Material.Filled.Description,
        _ => FodIcons.Material.Filled.InsertDriveFile
    };
}
```

### 9. Best Practices

1. **Securitate**:
   - Validați permisiunile înainte de afișare
   - Folosiți token-uri pentru URL-uri sigure
   - Implementați audit logging

2. **Performanță**:
   - Lazy loading pentru fișiere mari
   - Thumbnail-uri pentru imagini
   - Cache pentru fișiere frecvent accesate

3. **UX**:
   - Loading indicators clare
   - Mesaje de eroare descriptive
   - Suport pentru zoom în imagini
   - Navigare cu keyboard

### 10. Suport pentru Tipuri de Fișiere

```csharp
public static class FileTypeSupport
{
    public static bool IsViewable(string fileType)
    {
        var viewableTypes = new[]
        {
            // Imagini
            "image/jpeg", "image/png", "image/gif", "image/webp",
            // Documente
            "application/pdf",
            // Text
            "text/plain", "text/html",
            // Video (cu limitări)
            "video/mp4", "video/webm"
        };
        
        return viewableTypes.Contains(fileType.ToLower());
    }
    
    public static string GetViewerType(string fileType)
    {
        return fileType switch
        {
            var t when t.StartsWith("image/") => "image",
            "application/pdf" => "iframe",
            var t when t.StartsWith("video/") => "video",
            _ => "download"
        };
    }
}
```

### 11. Troubleshooting

#### Fișierul nu se afișează
- Verificați că endpoint-ul API returnează fișierul
- Verificați Content-Type corect
- Verificați permisiunile utilizatorului

#### Modal nu se deschide
- Verificați că `OpenFileViewAsync` este apelat
- Verificați că FileId este valid
- Verificați erori în consolă

### 12. Limitări și Alternative

**Limitări actuale**:
- Nu suportă editare
- Suport limitat pentru formate video
- Nu are zoom pentru PDF

**Alternative**:
- PDF.js pentru control avansat PDF
- ViewerJS pentru mai multe formate
- Google Docs Viewer pentru documente Office

### 13. Extensibilitate

```razor
@* FileViewerWithAnnotations.razor *@
<FodFileView @ref="baseViewer">
    <AdditionalContent>
        @if (IsAnnotatable)
        {
            <div class="annotation-toolbar">
                <FodButton OnClick="AddComment">
                    <FodIcon Icon="@FodIcons.Material.Filled.Comment" />
                    Adaugă comentariu
                </FodButton>
                <FodButton OnClick="Highlight">
                    <FodIcon Icon="@FodIcons.Material.Filled.Highlight" />
                    Evidențiază
                </FodButton>
            </div>
        }
    </AdditionalContent>
</FodFileView>
```

### 14. Concluzie

`FodFileView` oferă o soluție simplă și eficientă pentru vizualizarea fișierelor în aplicații Blazor. Cu suport pentru imagini și documente, integrare cu servicii de fișiere și o interfață modal responsivă, componenta acoperă majoritatea necesităților de previzualizare a documentelor.