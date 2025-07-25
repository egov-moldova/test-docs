# FodTHeadRow

## Documentație pentru componenta FodTHeadRow

### 1. Descriere Generală

`FodTHeadRow` reprezintă un rând de header într-un tabel `FodDataTable`. Componenta gestionează automat funcționalități precum checkbox pentru selecție totală, spații pentru butoane de editare și suport pentru rânduri expandabile.

Caracteristici principale:
- Checkbox pentru selectare/deselectare totală
- Integrare automată cu modul multi-selecție
- Suport pentru tabele editabile
- Spațiere automată pentru coloane expandabile
- Evenimente click personalizabile
- Sincronizare cu starea tabelului

### 2. Utilizare de Bază

#### Header simplu
```razor
<FodDataTable Items="items" T="Item">
    <HeaderContent>
        <FodTHeadRow>
            <FodTh>Nume</FodTh>
            <FodTh>Descriere</FodTh>
            <FodTh>Preț</FodTh>
        </FodTHeadRow>
    </HeaderContent>
</FodDataTable>
```

#### Header cu checkbox pentru selecție totală
```razor
<FodDataTable Items="users" T="User" MultiSelection="true">
    <HeaderContent>
        <FodTHeadRow IsCheckable="true">
            <FodTh>Utilizator</FodTh>
            <FodTh>Email</FodTh>
            <FodTh>Rol</FodTh>
        </FodTHeadRow>
    </HeaderContent>
</FodDataTable>
```

### 3. Parametri

| Proprietate | Tip | Descriere | Valoare Implicită |
|-------------|-----|-----------|-------------------|
| `IsCheckable` | `bool` | Adaugă checkbox pentru selectare totală | `false` |
| `IgnoreCheckbox` | `bool` | Nu randează coloană pentru checkbox | `false` |
| `IgnoreEditable` | `bool` | Nu randează coloană pentru editare | `false` |
| `IsExpandable` | `bool` | Adaugă spațiu pentru expandare | `false` |
| `OnRowClick` | `EventCallback<MouseEventArgs>` | Eveniment click pe rând | - |
| `ChildContent` | `RenderFragment` | Conținutul header-ului (celule FodTh) | - |

### 4. Exemple Avansate

#### Header complex cu sortare și filtrare
```razor
<FodDataTable Items="products" T="Product" 
              MultiSelection="true"
              EditMode="DataEditMode.Cell">
    <HeaderContent>
        <FodTHeadRow IsCheckable="true">
            <FodTh>
                <FodTableSortLabel T="Product" SortBy="@(p => p.Name)">
                    Produs
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Product" SortBy="@(p => p.Category)">
                    Categorie
                </FodTableSortLabel>
            </FodTh>
            <FodTh>
                <FodTableSortLabel T="Product" SortBy="@(p => p.Price)">
                    Preț
                </FodTableSortLabel>
            </FodTh>
            <FodTh>Acțiuni</FodTh>
        </FodTHeadRow>
    </HeaderContent>
</FodDataTable>
```

#### Header cu selecție condiționată
```razor
<FodDataTable @ref="dataTable" Items="orders" T="Order" MultiSelection="true">
    <HeaderContent>
        <FodTHeadRow IsCheckable="@canSelectAll" 
                     OnRowClick="HandleHeaderClick">
            <FodTh>Nr. Comandă</FodTh>
            <FodTh>Client</FodTh>
            <FodTh>Status</FodTh>
            <FodTh>Total</FodTh>
        </FodTHeadRow>
    </HeaderContent>
</FodDataTable>

@code {
    private FodDataTable<Order> dataTable;
    private bool canSelectAll = true;
    
    private void HandleHeaderClick(MouseEventArgs args)
    {
        // Logică personalizată pentru click pe header
        Console.WriteLine("Header clicked");
    }
    
    protected override void OnInitialized()
    {
        // Dezactivează selecția totală pentru anumiți utilizatori
        canSelectAll = CurrentUser.HasPermission("BulkSelect");
    }
}
```

#### Header pentru tabel expandabil
```razor
<FodDataTable Items="categories" T="Category">
    <HeaderContent>
        <FodTHeadRow IsExpandable="true">
            <FodTh>Categorie</FodTh>
            <FodTh>Produse</FodTh>
            <FodTh>Valoare totală</FodTh>
        </FodTHeadRow>
    </HeaderContent>
    <RowTemplate>
        <FodTr Item="@context" IsExpandable="true">
            <FodTd>@context.Name</FodTd>
            <FodTd>@context.ProductCount</FodTd>
            <FodTd>@context.TotalValue.ToString("C")</FodTd>
        </FodTr>
    </RowTemplate>
    <ChildRowContent>
        <!-- Detalii expandate -->
    </ChildRowContent>
</FodDataTable>
```

### 5. Integrare cu Moduri de Editare

#### Header pentru editare inline
```razor
<FodDataTable Items="inventory" T="InventoryItem" 
              EditMode="DataEditMode.Cell"
              EditTrigger="DataEditTrigger.OnRowClick">
    <HeaderContent>
        <FodTHeadRow IgnoreEditable="false">
            <FodTh>Cod Produs</FodTh>
            <FodTh>Denumire</FodTh>
            <FodTh>Cantitate</FodTh>
            <FodTh>Locație</FodTh>
        </FodTHeadRow>
    </HeaderContent>
</FodDataTable>
```

### 6. Stilizare și Personalizare

```css
/* Header personalizat */
.custom-header .fod-table-row {
    background-color: var(--fod-palette-primary-dark);
    color: white;
}

/* Checkbox în header */
.fod-table-row .fod-table-cell-checkbox {
    padding: 0;
    margin: 0;
}

/* Header sticky */
.sticky-table thead .fod-table-row {
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Header cu hover */
.interactive-header .fod-table-row:hover {
    background-color: rgba(0,0,0,0.04);
    cursor: pointer;
}
```

### 7. Funcționalități Automate

#### Gestionare checkbox
Componenta gestionează automat:
- Afișarea checkbox-ului când `MultiSelection="true"` pe tabel
- Starea checkbox-ului (checked/unchecked/indeterminate)
- Propagarea selecției către toate rândurile

#### Spațiere pentru editare
Când tabelul are `EditMode` activ:
- Adaugă automat coloane goale pentru butoanele de editare
- Respectă poziția butoanelor (Start/End)
- Se ajustează la configurația tabelului

### 8. Best Practices

1. **Un singur FodTHeadRow** - Folosiți doar unul per HeaderContent
2. **IsCheckable cu MultiSelection** - Activați doar când tabelul permite selecție multiplă
3. **IgnoreEditable pentru performanță** - Când nu aveți nevoie de editare
4. **Evenimente la nivel de celulă** - Preferați evenimente pe FodTh individual
5. **Consistență vizuală** - Păstrați același stil ca restul tabelului

### 9. Scenarii Complexe

#### Header cu acțiuni bulk
```razor
<FodDataTable @ref="table" Items="documents" T="Document" MultiSelection="true">
    <ToolBarContent>
        @if (table?.SelectedItems?.Count() > 0)
        {
            <FodButton OnClick="BulkDelete" Color="FodColor.Error">
                Șterge @table.SelectedItems.Count() documente
            </FodButton>
        }
    </ToolBarContent>
    <HeaderContent>
        <FodTHeadRow IsCheckable="true">
            <FodTh>Nume Document</FodTh>
            <FodTh>Tip</FodTh>
            <FodTh>Dimensiune</FodTh>
            <FodTh>Data</FodTh>
        </FodTHeadRow>
    </HeaderContent>
</FodDataTable>
```

### 10. Accesibilitate

- Structură semantică corectă cu `<tr>` în `<thead>`
- Suport pentru screen readers
- Navigare cu tastatură
- ARIA labels pentru checkbox

### 11. Troubleshooting

#### Checkbox nu apare
- Verificați că `MultiSelection="true"` pe DataTable
- Setați `IsCheckable="true"` pe FodTHeadRow
- Verificați că nu aveți `IgnoreCheckbox="true"`

#### Coloane extra nedorite
- Setați `IgnoreEditable="true"` dacă nu editați
- Verificați configurația EditMode pe tabel

#### Header nu se aliniază cu rânduri
- Verificați numărul de FodTh vs FodTd
- Includeți coloane pentru checkbox/editare

### 12. Concluzie

`FodTHeadRow` simplifică crearea header-elor de tabel prin gestionarea automată a funcționalităților comune. Cu suport integrat pentru selecție multiplă și editare, componenta asigură consistență și reduce codul boilerplate în aplicațiile FOD.