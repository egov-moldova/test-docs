# FodVirtualize

## Descriere Generală

Componenta `FodVirtualize` oferă un wrapper configurabil peste componenta nativă Blazor `Virtualize`. Permite randarea eficientă a listelor mari de elemente prin virtualizare, randând doar elementele vizibile în viewport plus un număr configurabil de elemente suplimentare (overscan). Componenta poate fi dezactivată pentru a randa toate elementele simultan când este necesar.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodVirtualize Items="@products" IsEnabled="true">
    <div class="product-item">
        <h4>@context.Name</h4>
        <p>@context.Price lei</p>
    </div>
</FodVirtualize>

@code {
    private List<Product> products = GenerateProducts(1000);
}
```

### Dezactivare virtualizare

```razor
<FodVirtualize Items="@items" IsEnabled="false">
    <FodListItem>
        @context.Title
    </FodListItem>
</FodVirtualize>

@code {
    private List<Item> items = new();
    // Când IsEnabled=false, toate elementele sunt randate
}
```

### Cu overscan personalizat

```razor
<FodVirtualize Items="@largeDataSet" IsEnabled="true" OverscanCount="5">
    <div class="data-row">
        <span>ID: @context.Id</span>
        <span>@context.Description</span>
        <span>@context.Date.ToShortDateString()</span>
    </div>
</FodVirtualize>

@code {
    private List<DataItem> largeDataSet = LoadLargeDataSet();
}
```

### În FodDataTable

```razor
<FodDataTable>
    <FodVirtualize Items="@tableRows" IsEnabled="@enableVirtualization">
        <tr>
            <td>@context.Column1</td>
            <td>@context.Column2</td>
            <td>@context.Column3</td>
        </tr>
    </FodVirtualize>
</FodDataTable>

@code {
    private bool enableVirtualization = tableRows.Count > 50;
}
```

### Cu componente complexe

```razor
<FodVirtualize Items="@complexItems" IsEnabled="true" OverscanCount="2">
    <FodCard Class="mb-3">
        <CardContent>
            <FodCardTitle>@context.Title</FodCardTitle>
            <FodCardText>@context.Content</FodCardText>
            <FodButton OnClick="@(() => SelectItem(context))">
                Selectează
            </FodButton>
        </CardContent>
    </FodCard>
</FodVirtualize>
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| IsEnabled | bool | false | Activează/dezactivează virtualizarea |
| Items | ICollection<T> | null | Colecția de elemente de afișat |
| ChildContent | RenderFragment<T> | - | Template-ul pentru randarea fiecărui element |
| OverscanCount | int | 3 | Numărul de elemente randate în afara viewport-ului |

## Evenimente

Componenta nu expune evenimente proprii.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **Virtualize** - Componenta nativă Blazor utilizată intern
- Poate fi folosită cu orice componentă FOD pentru afișare liste

## Stilizare

Componenta nu adaugă stiluri proprii. Stilizarea se aplică pe elementele randate prin `ChildContent`.

### Exemplu stilizare

```css
/* Container pentru virtualizare */
.virtualize-container {
    height: 500px;
    overflow-y: auto;
}

/* Stilizare elemente */
.virtualize-container .item {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
}

/* Smooth scrolling */
.virtualize-container {
    scroll-behavior: smooth;
}
```

## Note și observații

1. **Performance** - Îmbunătățește semnificativ performanța pentru liste mari
2. **Înălțime fixă** - Containerul trebuie să aibă înălțime definită pentru scrolling
3. **Overscan** - Valori mai mari reduc flickering dar cresc memoria folosită
4. **Generic type** - Componenta este generică și funcționează cu orice tip de date
5. **Fallback** - Când IsEnabled=false, folosește un simplu foreach

## Bune practici

1. **Prag activare** - Activați virtualizarea doar pentru liste cu peste 50-100 elemente
2. **Înălțime consistentă** - Elementele ar trebui să aibă înălțimi similare pentru scrolling fluid
3. **OverscanCount** - Folosiți 3-5 pentru majoritatea cazurilor
4. **Container height** - Setați întotdeauna înălțimea containerului părinte
5. **Loading states** - Gestionați stările de încărcare pentru date asincrone

## Exemple avansate

### Cu încărcare dinamică

```razor
<div style="height: 600px; overflow-y: auto;">
    <FodVirtualize Items="@visibleItems" IsEnabled="true">
        @if (context.IsLoading)
        {
            <FodLoadingLinear />
        }
        else
        {
            <ItemDisplay Item="@context" />
        }
    </FodVirtualize>
</div>
```

### Virtualizare condiționată

```razor
@if (UseVirtualization)
{
    <FodVirtualize Items="@allItems" IsEnabled="true">
        <ItemTemplate Context="@context" />
    </FodVirtualize>
}
else
{
    <FodPagination Items="@allItems" PageSize="20">
        <ItemTemplate Context="@context" />
    </FodPagination>
}

@code {
    private bool UseVirtualization => allItems.Count > 100;
}
```

## Concluzie

FodVirtualize oferă o soluție flexibilă pentru optimizarea performanței listelor mari în aplicații Blazor. Cu posibilitatea de a activa/dezactiva virtualizarea și control asupra parametrilor de overscan, componenta permite dezvoltatorilor să balanseze între performanță și experiența utilizatorului.