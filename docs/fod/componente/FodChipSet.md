# ChipSet  
**Documentație – FodChipSet**

## Descriere  
`FodChipSet` este utilizat pentru a crea grupuri de selecții folosind componente `FodChip`. Aceasta permite utilizatorilor să selecteze una sau mai multe opțiuni, oferind suport pentru selecție unică și selecție multiplă.  
Pentru mai multe detalii despre utilizarea chip-urilor individuale, vezi `FodChip`.

---

## Proprietăți

| Nume         | Tip         | Descriere                                              | Valoare Implicită |
|--------------|-------------|----------------------------------------------------------|-------------------|
| SelectedChip | `FodChip`   | Reprezintă chip-ul selectat în mod unic.               | `null`            |
| Filter       | `bool`      | Activează filtrarea în chipset.                        | `false`           |
| Mandatory    | `bool`      | Dacă este `true`, un chip selectat nu poate fi deselectat. | `false`      |

---

## Exemple de utilizare

### 1. Selecție unică cu opțiune obligatorie

```razor
<FodChipSet @bind-SelectedChip="selected" Filter="true" Mandatory="@mandatory">
    <FodChip Text="grey">Default</FodChip>
    <FodChip Text="purple" Color="FodColor.Primary">Primary</FodChip>
    <FodChip Text="pink" Color="FodColor.Secondary">Secondary</FodChip>
    <FodChip Text="blue" Color="FodColor.Info">Info</FodChip>
    <FodChip Text="green" Color="FodColor.Success">Success</FodChip>
    <FodChip Text="orange" Color="FodColor.Warning">Warning</FodChip>
    <FodChip Text="red" Color="FodColor.Error">Error</FodChip>
    <FodChip Text="black" Color="FodColor.Dark">Dark</FodChip>
</FodChipSet>

<div class="d-flex flex-column align-center">
    @if (selected != null)
    {
        <FodText>You selected the <FodText Color="@selected.Color" Inline="true">@selected.Text</FodText> chip.</FodText>
    }
    <FodCheckBox2 @bind-Checked="mandatory">Mandatory</FodCheckBox2>
</div>

@code {
    bool mandatory = true;
    FodChip selected;
}
