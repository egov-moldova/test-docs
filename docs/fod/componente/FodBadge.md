# Badge

## Documentație FodBadge

### Prezentare Generală
Componenta `FodBadge` este un element UI versatil utilizat pentru a suprapune sau a încadra un buton de acțiune, o pictogramă sau alte elemente cu un badge de notificare simplu. Acesta este deosebit de util pentru a indica numărul de notificări necitite, alerte sau alți indicatori importanți.

### Caracteristici
- Suportă conținut numeric și bazat pe text.
- Aspect configurabil cu teme de culoare și niveluri de elevație.
- Poate afișa o pictogramă în interiorul badge-ului.
- Suportă modul punct pentru notificări minimaliste.
- Permite suprapunerea badge-urilor peste elementele copil.
- Stiluri opționale de bordură.
- Gestionarea evenimentelor de clic.

### Exemplu de Utilizare
```razor
<div Class="d-flex justify-space-around flex-wrap mt-4">
    <FodBadge Content="3" Overlap="true" Class="mx-5 my-4">
        <FodIcon Icon="@FodIcons.Material.Filled.Email" Color="FodColor.Default" />
    </FodBadge>
    <FodBadge Content="100" Color="FodColor.Primary" Overlap="true" Class="mx-5 my-4">
        <FodIcon Icon="@FodIcons.Material.Filled.Email" Color="FodColor.Default" />
    </FodBadge>
    <FodBadge Icon="@FodIcons.Material.Filled.Lock" Color="FodColor.Error" Overlap="true" Bordered="true" Class="mx-5 my-4">
        <FodButton Color="FodColor.Error" Variant="FodVariant.Filled" DisableElevation="true">Probleme de Securitate</FodButton>
    </FodBadge>
    <FodBadge Dot="true" Color="FodColor.Info" Class="mx-5 my-4">
        <FodText>Raportări de Bug-uri</FodText>
    </FodBadge>
</div>
```

### Parametri

| Parametru     | Tip                         | Implicit | Descriere                                                                 |
|--------------|-----------------------------|----------|---------------------------------------------------------------------------|
| `Origin`     | `Origin`                    | `TopRight` | Poziția badge-ului.                                                      |
| `Elevation`  | `int`                       | `0`      | Specifică adâncimea umbrei pentru accent vizual.                         |
| `Visible`    | `bool`                      | `true`   | Determină dacă badge-ul este afișat.                                     |
| `Color`      | `FodColor`                  | `Default`| Definirea culorii badge-ului.                                            |
| `Dot`        | `bool`                      | `false`  | Dacă este activat, badge-ul își reduce dimensiunea și ascunde conținutul.|
| `Overlap`    | `bool`                      | `false`  | Dacă este activat, badge-ul se suprapune peste conținutul copil.         |
| `Bordered`   | `bool`                      | `false`  | Dacă este activat, aplică o bordură în jurul badge-ului.                 |
| `Icon`       | `string`                    | `null`   | Afișează o pictogramă în interiorul badge-ului.                          |
| `Max`        | `int`                       | `99`     | Definirea valorii maxime afișabile când conținutul este un număr întreg.|
| `Content`    | `object`                    | `null`   | Conținutul din interiorul badge-ului (string sau număr întreg).          |
| `BadgeClass` | `string`                    | `null`   | Clase CSS adiționale pentru personalizare.                               |
| `ChildContent`| `RenderFragment`           | `null`   | Conținutul pe care badge-ul îl încadrează.                               |
| `OnClick`    | `EventCallback<MouseEventArgs>` | `null`   | Eveniment declanșat la clic pe badge.                                    |

### Stilizare
Componenta `FodBadge` utilizează `CssBuilder` pentru a genera dinamic numele claselor CSS pe baza parametrilor furnizați. Mai jos sunt câteva structuri de clasă cheie:

- `.fod-badge-root` – Clasa de bază pentru componenta badge.
- `.fod-badge-wrapper` – Clasa de încadrare pentru poziționarea badge-ului.
- `.fod-badge` – Stilul principal al badge-ului.
- `.fod-badge-dot` – Aplică aspectul de punct.
- `.fod-badge-bordered` – Activează bordura în jurul badge-ului.
- `.fod-badge-icon` – Utilizat când badge-ul conține o pictogramă.
- `.fod-elevation-{level}` – Aplică efectul de elevație (umbrire).
- `.fod-theme-{color}` – Atribuie o temă de culoare badge-ului.
- `.fod-badge-overlap` – Aplică stilul de suprapunere.

### Gestionarea Evenimentelor de Clic
Pentru a gestiona evenimentele de clic pe badge, utilizați parametrul `OnClick`:

```razor
<FodBadge Content="5" OnClick="HandleBadgeClick">
    <FodIcon Icon="@FodIcons.Material.Filled.Notifications" />
</FodBadge>

@code {
    private void HandleBadgeClick(MouseEventArgs e)
    {
        Console.WriteLine("Badge apăsat!");
    }
}
```

### Rezumat
Componenta `FodBadge` este o modalitate flexibilă și atrăgătoare de a afișa notificări, numărători și alerte în aplicația dvs. Suportă diverse opțiuni de personalizare, făcând-o adaptabilă pentru diferite modele UI și nevoi ale utilizatorilor.