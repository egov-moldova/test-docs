# FileViewer

## Descriere Generală

Componenta `FileViewer` oferă o interfață simplă pentru afișarea și previzualizarea fișierelor încărcate. Afișează numele fișierului împreună cu un buton de previzualizare care deschide fișierul într-o componentă `FodFileView` pentru vizualizare detaliată.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FileViewer Model="@uploadedFile" />

@code {
    private FodUploadedFileModel uploadedFile = new()
    {
        Id = Guid.NewGuid(),
        FileName = "document.pdf"
    };
}
```

### Mod doar vizualizare

```razor
<FileViewer Model="@fileModel" ViewOnly="true" />

@code {
    private FodUploadedFileModel fileModel = new()
    {
        Id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000"),
        FileName = "raport-anual-2024.xlsx"
    };
}
```

### În listă de fișiere

```razor
@foreach (var file in uploadedFiles)
{
    <div class="file-item mb-2">
        <FileViewer Model="@file" />
    </div>
}

@code {
    private List<FodUploadedFileModel> uploadedFiles = new();
}
```

### Cu stilizare personalizată

```razor
<div class="custom-file-viewer">
    <FileViewer Model="@document" />
</div>

<style>
    .custom-file-viewer {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
        background-color: #f9f9f9;
    }
</style>
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Model | FodUploadedFileModel | - | Modelul cu informațiile fișierului (obligatoriu) |
| ViewOnly | bool | false | Activează modul doar pentru vizualizare |

### Proprietăți FodUploadedFileModel

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| Id | Guid? | Identificatorul unic al fișierului |
| FileName | string | Numele fișierului pentru afișare |

## Evenimente

Componenta nu expune evenimente publice.

## Metode publice

Componenta nu expune metode publice direct, dar gestionează intern deschiderea previzualizării.

## Componente asociate

- **FodFileView** - Componenta pentru afișarea efectivă a conținutului fișierului
- **FodButton** - Butonul pentru declanșarea previzualizării
- **FodUploadedFileModel** - Modelul de date pentru fișier

## Stilizare

Componenta folosește clase Bootstrap pentru layout:
- `.d-flex` - Container flexbox
- `.mr-auto` - Margin dreapta auto pentru numele fișierului
- `.p-2` - Padding pentru elemente

### Structura vizuală

```
┌─────────────────────────────────────┐
│ document.pdf              [👁️]      │
└─────────────────────────────────────┘
```

### Personalizare

```css
/* Container principal */
.file-viewer-container {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    transition: background-color 0.3s;
}

.file-viewer-container:hover {
    background-color: #f5f5f5;
}

/* Nume fișier */
.file-viewer-container label {
    margin: 0;
    font-weight: 500;
    color: #333;
}

/* Buton preview */
.file-viewer-container .fod-button {
    padding: 0.25rem 0.5rem;
}
```

## Note și observații

1. **FodFileView referință** - Componenta păstrează o referință internă la FodFileView
2. **ID obligatoriu** - Fișierul trebuie să aibă un ID valid pentru previzualizare
3. **ViewOnly neimplementat** - Parametrul ViewOnly este definit dar nu afectează comportamentul
4. **Bootstrap dependency** - Folosește clase Bootstrap pentru layout

## Bune practici

1. **Validare model** - Verificați că Model și Model.Id nu sunt null
2. **Nume descriptive** - Asigurați-vă că FileName este descriptiv și include extensia
3. **Gestionare erori** - Implementați tratarea erorilor pentru fișiere lipsă
4. **Loading state** - Considerați afișarea unui indicator de încărcare
5. **Tipuri suportate** - Verificați că tipul fișierului poate fi previzualizat

## Exemple avansate

### Cu validare și erori

```razor
@if (file?.Id != null)
{
    <FileViewer Model="@file" />
}
else
{
    <FodAlert Severity="FodSeverity.Warning">
        Fișierul nu poate fi previzualizat
    </FodAlert>
}
```

### În formular cu multiple fișiere

```razor
<div class="uploaded-files-section">
    <h5>Documente încărcate</h5>
    
    @if (!uploadedFiles.Any())
    {
        <p class="text-muted">Nu există documente încărcate</p>
    }
    else
    {
        @foreach (var file in uploadedFiles)
        {
            <div class="file-row d-flex align-items-center mb-2">
                <div class="flex-grow-1">
                    <FileViewer Model="@file" />
                </div>
                <FodIconButton Icon="@FodIcons.Material.Filled.Delete" 
                               Color="FodColor.Error"
                               OnClick="@(() => RemoveFile(file.Id))" />
            </div>
        }
    }
</div>

@code {
    private List<FodUploadedFileModel> uploadedFiles = new();

    private void RemoveFile(Guid? fileId)
    {
        uploadedFiles.RemoveAll(f => f.Id == fileId);
    }
}
```

### Cu informații adiționale

```razor
<div class="enhanced-file-viewer">
    <div class="file-info">
        <FileViewer Model="@fileWithMetadata" />
        <small class="text-muted">
            Încărcat: @fileUploadDate.ToString("dd.MM.yyyy HH:mm")
            | Dimensiune: @FormatFileSize(fileSize)
        </small>
    </div>
</div>

@code {
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

## Concluzie

FileViewer oferă o modalitate simplă și eficientă de a afișa fișiere încărcate cu opțiune de previzualizare. Deși minimalistă în design, componenta se integrează perfect cu FodFileView pentru a oferi funcționalitate completă de vizualizare a documentelor în aplicații.