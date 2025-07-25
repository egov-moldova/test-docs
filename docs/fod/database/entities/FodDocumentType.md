# FodDocumentType

## Descriere

Entitatea care definește tipurile de documente disponibile în sistemul Front Office Digital. Această entitate conține catalogul tuturor tipurilor de documente care pot fi solicitate, împreună cu caracteristicile lor specifice precum necesitatea apostilării sau livrării.

## Proprietăți

### Informații de Bază

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| Id | Guid | Identificator unic al tipului de document | Primary Key, moștenit din BaseEntity |
| Name | string | Denumirea tipului de document | Obligatoriu |
| Code | string | Codul unic al tipului de document | Obligatoriu, folosit pentru identificare în sistem |
| RequiresApostilation | bool | Indică dacă documentul necesită apostilare | Default: false |
| RequiresDelivery | bool | Indică dacă documentul necesită livrare | Default: false |

### Metadate (moștenite din BaseEntity)

| Proprietate | Tip | Descriere | Constrângeri |
|------------|-----|-----------|-------------|
| CreatedDate | DateTime | Data creării înregistrării | Setată automat |
| ModifiedDate | DateTime | Data ultimei modificări | Actualizată automat |
| CreatedBy | string? | Identificatorul utilizatorului care a creat înregistrarea | - |
| ModifiedBy | string? | Identificatorul utilizatorului care a modificat ultima dată | - |
| Version | byte[] | Versiunea înregistrării pentru concurrency control | Rowversion |
| TenantId | string? | ID-ul tenant-ului pentru multi-tenancy | - |

## Relații

### Relații One-to-Many (Copii)
- **DocumentTypeServices** (`ICollection<FodServiceDocumentType>`) - Serviciile care pot emite acest tip de document

## Exemple de Utilizare

### Creare Tip Document Nou
```csharp
var documentType = new FodDocumentType
{
    Name = "Certificat de naștere",
    Code = "CERT_NASTERE",
    RequiresApostilation = true,
    RequiresDelivery = true
};

context.FodDocumentTypes.Add(documentType);
await context.SaveChangesAsync();
```

### Listare Tipuri de Documente
```csharp
var documentTypes = await context.FodDocumentTypes
    .OrderBy(dt => dt.Name)
    .Select(dt => new
    {
        dt.Id,
        dt.Name,
        dt.Code,
        dt.RequiresApostilation,
        dt.RequiresDelivery
    })
    .ToListAsync();
```

### Căutare după Cod
```csharp
var certificatNastere = await context.FodDocumentTypes
    .FirstOrDefaultAsync(dt => dt.Code == "CERT_NASTERE");

if (certificatNastere.RequiresApostilation)
{
    // Logică pentru procesare apostilare
}
```

### Documente care Necesită Livrare
```csharp
var documentsForDelivery = await context.FodDocumentTypes
    .Where(dt => dt.RequiresDelivery)
    .Include(dt => dt.DocumentTypeServices)
        .ThenInclude(dts => dts.Service)
    .ToListAsync();
```

## Note Importante

1. **Coduri Unice**: Câmpul `Code` trebuie să fie unic în sistem și este folosit pentru identificarea tipului de document în integrări și procesări automate.

2. **Caracteristici Importante**:
   - `RequiresApostilation` determină dacă documentul necesită proces de apostilare internațională
   - `RequiresDelivery` indică dacă documentul poate fi livrat la domiciliu

3. **Relație cu Servicii**:
   - Un tip de document poate fi emis de multiple servicii
   - Relația este gestionată prin entitatea intermediară `FodServiceDocumentType`

4. **Catalog Centralizat**:
   - Această entitate servește ca un catalog centralizat pentru toate tipurile de documente
   - Modificările se reflectă automat în toate serviciile care emit aceste documente

5. **Considerații de Business**:
   - Tipurile de documente sunt de obicei configurate la instalarea sistemului
   - Modificările necesită aprobare și pot afecta fluxurile existente
   - Codul documentului nu ar trebui schimbat după ce a fost utilizat în producție


