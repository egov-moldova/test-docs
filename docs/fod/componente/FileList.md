# FileList

## Documentație pentru componenta FileList

### 1. Descriere Generală

`FileList` este o componentă pentru afișarea și gestionarea unei liste de fișiere încărcate. Oferă funcționalități de vizualizare, ștergere și preview pentru fișiere, integrat cu serviciul de upload și componenta FodFileView.

Caracteristici principale:
- Afișare listă fișiere cu detalii
- Buton preview pentru vizualizare fișier
- Buton ștergere cu confirmare
- Integrare cu IFileUploadService
- Loading state pentru operațiuni
- Integrare automată cu FodFileView
- Suport pentru callback-uri personalizate

### 2. Utilizare de Bază

#### Listă simplă de fișiere
```razor
<FileList Model="@uploadedFiles" />

@code {
    private IEnumerable<FileUploadResponseModel> uploadedFiles = new List<FileUploadResponseModel>();
}
```

#### Listă cu butoane personalizate
```razor
<FileList Model="@files"
          ColorDelete="FodColor.Error"
          ColorPreviewButton="FodColor.Primary"
          DeleteText="Șterge"
          OnClickDelete="HandleFileDeleted" />

@code {
    private async Task HandleFileDeleted(Guid? fileId)
    {
        // Logică după ștergere
        await NotificationService.ShowSuccess("Fișier șters cu succes!");
    }
}
```

### 3. Parametri

| Parametru | Tip | Descriere | Valoare Implicită |
|-----------|-----|-----------|-------------------|
| `Model` | `IEnumerable<FileUploadResponseModel>` | Lista de fișiere | - |
| `ColorDownload` | `FodColor` | Culoarea butonului de descărcare | - |
| `ColorDelete` | `FodColor` | Culoarea butonului de ștergere | - |
| `OnClickDownload` | `EventCallback` | Eveniment la descărcare | - |
| `OnClickDelete` | `EventCallback<Guid?>` | Eveniment după ștergere | - |
| `OnStartDelete` | `EventCallback` | Eveniment înainte de ștergere | - |
| `DownloadText` | `string` | Text buton descărcare | - |
| `DeleteText` | `string` | Text buton ștergere | - |
| `ColorPreviewButton` | `FodColor?` | Culoarea butonului preview | `Primary` |

### 4. Model FileUploadResponseModel

```csharp
public class FileUploadResponseModel
{
    public Guid Id { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public long FileSize { get; set; }
    public DateTime UploadDate { get; set; }
    // alte proprietăți
}
```

### 5. Exemple Avansate

#### Gestiune completă fișiere cu validare
```razor
<FodCard>
    <FodCardContent>
        <FodText Typo="Typo.h6">Documente încărcate</FodText>
        
        @if (files.Any())
        {
            <FileList Model="@files"
                      ColorDelete="FodColor.Error"
                      ColorPreviewButton="FodColor.Info"
                      DeleteText="Elimină"
                      OnStartDelete="OnBeforeDelete"
                      OnClickDelete="OnAfterDelete" />
                      
            <FodText Typo="Typo.body2" Color="FodColor.TextSecondary">
                Total: @files.Count() fișiere (@FormatFileSize(totalSize))
            </FodText>
        }
        else
        {
            <FodAlert Severity="FodSeverity.Info">
                Nu există fișiere încărcate.
            </FodAlert>
        }
    </FodCardContent>
</FodCard>

@code {
    private List<FileUploadResponseModel> files = new();
    private long totalSize => files.Sum(f => f.FileSize);
    
    private async Task OnBeforeDelete()
    {
        // Verificări înainte de ștergere
        if (files.Count == 1)
        {
            var confirm = await DialogService.ShowConfirm(
                "Ultimul fișier", 
                "Aceasta este ultimul fișier. Sigur doriți să-l ștergeți?");
            
            if (!confirm) 
                throw new OperationCanceledException();
        }
    }
    
    private async Task OnAfterDelete(Guid? fileId)
    {
        // Actualizare listă locală
        files = files.Where(f => f.Id != fileId).ToList();
        
        // Notificare
        await NotificationService.ShowInfo($"Fișier șters. Mai rămân {files.Count} fișiere.");
        
        // Verificare cerințe minime
        await ValidateFileRequirements();
    }
    
    private string FormatFileSize(long bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB" };
        int order = 0;
        double size = bytes;
        
        while (size >= 1024 && order < sizes.Length - 1)
        {
            order++;
            size /= 1024;
        }
        
        return $"{size:0.##} {sizes[order]}";
    }
}
```

#### Integrare cu upload component
```razor
<div class="file-upload-section">
    <FodInputFile OnChange="HandleFileUpload"
                  Accept=".pdf,.doc,.docx"
                  Multiple="true">
        <ButtonContent>
            <FodButton Color="FodColor.Primary" Variant="FodVariant.Outlined">
                <FodIcon Icon="@FodIcons.Material.Filled.Upload" />
                Încarcă documente
            </FodButton>
        </ButtonContent>
    </FodInputFile>
    
    @if (isUploading)
    {
        <FodLoadingLinear />
    }
    
    <FodDivider Class="my-3" />
    
    <FileList Model="@uploadedFiles"
              ColorDelete="FodColor.Error"
              ColorPreviewButton="FodColor.Secondary"
              DeleteText=""
              OnClickDelete="RefreshFileList" />
</div>

@code {
    [Inject] private IFileUploadService FileService { get; set; }
    
    private List<FileUploadResponseModel> uploadedFiles = new();
    private bool isUploading;
    
    private async Task HandleFileUpload(InputFileChangeEventArgs e)
    {
        isUploading = true;
        
        try
        {
            foreach (var file in e.GetMultipleFiles())
            {
                var response = await FileService.UploadFile(file);
                uploadedFiles.Add(response);
            }
        }
        catch (Exception ex)
        {
            await NotificationService.ShowError($"Eroare upload: {ex.Message}");
        }
        finally
        {
            isUploading = false;
        }
    }
    
    private async Task RefreshFileList(Guid? deletedFileId)
    {
        // Re-fetch lista actualizată
        uploadedFiles = (await FileService.GetUserFiles()).ToList();
    }
}
```

#### Categorizare fișiere după tip
```razor
@foreach (var category in fileCategories)
{
    <FodExpansionPanel Title="@category.Key" 
                       BadgeContent="@category.Value.Count.ToString()">
        <FileList Model="@category.Value"
                  ColorPreviewButton="@GetColorForType(category.Key)"
                  DeleteText="Șterge"
                  OnClickDelete="@(id => HandleDeleteByCategory(id, category.Key))" />
    </FodExpansionPanel>
}

@code {
    private Dictionary<string, List<FileUploadResponseModel>> fileCategories;
    
    protected override void OnInitialized()
    {
        fileCategories = allFiles
            .GroupBy(f => GetFileCategory(f.FileType))
            .ToDictionary(g => g.Key, g => g.ToList());
    }
    
    private string GetFileCategory(string fileType) => fileType switch
    {
        ".pdf" => "Documente PDF",
        ".doc" or ".docx" => "Documente Word",
        ".jpg" or ".jpeg" or ".png" => "Imagini",
        _ => "Altele"
    };
    
    private FodColor GetColorForType(string category) => category switch
    {
        "Documente PDF" => FodColor.Error,
        "Documente Word" => FodColor.Info,
        "Imagini" => FodColor.Success,
        _ => FodColor.Default
    };
    
    private async Task HandleDeleteByCategory(Guid? fileId, string category)
    {
        fileCategories[category].RemoveAll(f => f.Id == fileId);
        
        if (!fileCategories[category].Any())
        {
            fileCategories.Remove(category);
        }
        
        StateHasChanged();
    }
}
```

### 6. Stilizare CSS

```css
/* Lista de fișiere */
.file-list ul {
    padding-left: 0;
    margin: 0;
}

.file-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid var(--fod-palette-divider);
    transition: background-color 0.2s;
}

.file-list li:hover {
    background-color: var(--fod-palette-action-hover);
}

.file-list li:last-child {
    border-bottom: none;
}

/* Butoane acțiuni */
.file-list .ps-2 {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

/* Responsive */
@media (max-width: 576px) {
    .file-list li {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .file-list .ps-2 {
        margin-left: 0;
        margin-top: 0.5rem;
    }
}
```

### 7. Integrare cu Servicii

#### Extensie pentru funcționalități avansate
```csharp
public interface IFileListService
{
    Task<bool> ValidateFiles(IEnumerable<FileUploadResponseModel> files);
    Task<Dictionary<string, int>> GetFileStatistics(IEnumerable<Guid> fileIds);
    Task<bool> ArchiveFiles(IEnumerable<Guid> fileIds);
}

// În componenta Blazor
@inject IFileListService FileListService

private async Task ValidateAndDisplay()
{
    var isValid = await FileListService.ValidateFiles(uploadedFiles);
    
    if (!isValid)
    {
        await NotificationService.ShowWarning("Unele fișiere necesită atenție!");
    }
}
```

### 8. Scenarii de Utilizare

#### Manager documente cu versioning
```razor
<FodTabs>
    <FodTabPanel Title="Versiune curentă">
        <FileList Model="@currentVersionFiles"
                  ColorPreviewButton="FodColor.Primary"
                  OnClickDelete="HandleDeleteCurrent" />
    </FodTabPanel>
    
    <FodTabPanel Title="Versiuni anterioare">
        @foreach (var version in fileVersions.OrderByDescending(v => v.Key))
        {
            <FodText Typo="Typo.subtitle2">Versiunea @version.Key</FodText>
            <FileList Model="@version.Value"
                      ColorPreviewButton="FodColor.Secondary"
                      ColorDelete="FodColor.Default"
                      DeleteText="Arhivează" />
        }
    </FodTabPanel>
</FodTabs>
```

#### Workflow aprobare documente
```razor
<FileList Model="@documentsForApproval">
    <AdditionalActions>
        <FodButton Color="FodColor.Success" 
                   Size="FodSize.Small"
                   OnClick="() => ApproveDocument(context.Id)">
            <FodIcon Icon="@FodIcons.Material.Filled.Check" />
        </FodButton>
        <FodButton Color="FodColor.Error" 
                   Size="FodSize.Small"
                   OnClick="() => RejectDocument(context.Id)">
            <FodIcon Icon="@FodIcons.Material.Filled.Close" />
        </FodButton>
    </AdditionalActions>
</FileList>
```

### 9. Best Practices

1. **Confirmare ștergere** - Întotdeauna confirmați ștergerea
2. **Loading states** - Afișați feedback în timpul operațiilor
3. **Error handling** - Tratați erorile de rețea
4. **Batch operations** - Pentru multe fișiere, oferiți operații batch
5. **File validation** - Validați tipul și dimensiunea fișierelor
6. **Accessibility** - Adăugați descrieri pentru screen readers

### 10. Performanță

- Lazy loading pentru liste mari
- Paginare pentru mai mult de 20 fișiere
- Cache preview-uri generate
- Debounce pentru operații rapide

### 11. Securitate

- Validați permisiunile pentru fiecare operație
- Sanitizați numele fișierelor afișate
- Verificați tipul MIME real al fișierelor
- Implementați rate limiting pentru descărcări

### 12. Troubleshooting

#### Fișierele nu se afișează
- Verificați că Model conține date valide
- Verificați că IFileUploadService este înregistrat
- Verificați permisiunile utilizatorului

#### Preview nu funcționează
- Verificați că FodFileView este disponibil
- Verificați suportul browser pentru tipul de fișier
- Verificați dimensiunea maximă pentru preview

### 13. Extensibilitate

```razor
@* FileListExtended.razor - Componentă extinsă *@
@inherits FileList

<div class="file-list-extended">
    @base.BuildRenderTree(__builder)
    
    @if (ShowStatistics)
    {
        <div class="file-statistics">
            <FodText>Total: @Model.Count() fișiere</FodText>
            <FodText>Dimensiune: @FormatTotalSize()</FodText>
        </div>
    }
</div>

@code {
    [Parameter] public bool ShowStatistics { get; set; }
    
    private string FormatTotalSize()
    {
        var totalBytes = Model.Sum(f => f.FileSize);
        // Format logic
    }
}
```

### 14. Concluzie

`FileList` oferă o soluție completă pentru gestionarea listelor de fișiere în aplicații Blazor. Cu funcționalități de preview, ștergere și integrare strânsă cu serviciile de fișiere, componenta simplifică dezvoltarea interfețelor de management al documentelor.