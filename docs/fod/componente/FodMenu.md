# FodMenu

## Descriere Generală

Componenta `FodMenu` oferă un meniu de navigare lateral (sidebar) care poate fi extins sau restrâns. Este ideală pentru crearea de meniuri principale în aplicații, oferind o experiență de navigare intuitivă cu animații fluide pentru tranziția între stările deschis/închis.

Componenta funcționează împreună cu `FodMenuItem` pentru a crea o structură ierarhică de navigare, unde meniul principal controlează vizibilitatea textului elementelor de meniu.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodMenu @bind-IsOpen="isMenuOpen">
    <FodMenuItem Icon="oi-home" Href="/">
        Acasă
    </FodMenuItem>
    <FodMenuItem Icon="oi-document" Href="/documents">
        Documente
    </FodMenuItem>
    <FodMenuItem Icon="oi-cog" Href="/settings">
        Setări
    </FodMenuItem>
</FodMenu>

@code {
    private bool isMenuOpen = true;
}
```

### Meniu cu culoare personalizată

```razor
<FodMenu Color="FodColor.Primary" IsOpen="true">
    <FodMenuItem Icon="oi-dashboard" Href="/dashboard">
        Dashboard
    </FodMenuItem>
    <FodMenuItem Icon="oi-people" Href="/users">
        Utilizatori
    </FodMenuItem>
    <FodMenuItem Icon="oi-bar-chart" Href="/reports">
        Rapoarte
    </FodMenuItem>
</FodMenu>
```

### Meniu cu acțiuni pe click

```razor
<FodMenu IsOpen="false">
    <FodMenuItem Icon="oi-file" OnClick="@(() => NavigateToPage("files"))">
        Fișiere
    </FodMenuItem>
    <FodMenuItem Icon="oi-envelope-closed" OnClick="@ShowMessages">
        Mesaje
    </FodMenuItem>
    <FodMenuItem Icon="oi-account-logout" OnClick="@Logout">
        Ieșire
    </FodMenuItem>
</FodMenu>

@code {
    private void NavigateToPage(string page)
    {
        // Logică de navigare
    }

    private void ShowMessages()
    {
        // Afișare mesaje
    }

    private void Logout()
    {
        // Logică de deconectare
    }
}
```

## Atribute disponibile

### FodMenu

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| ChildContent | RenderFragment | - | Conținutul meniului (elementele FodMenuItem) |
| Color | FodColor | Default | Culoarea meniului |
| IsOpen | bool | false | Starea meniului (deschis/închis) |
| Class | string | - | Clase CSS adiționale |
| Style | string | - | Stiluri inline |

### FodMenuItem

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| ChildContent | RenderFragment | - | Textul elementului de meniu |
| Icon | string | - | Clasa pentru iconiță (ex: "oi-home") |
| IconColor | FodColor | Default | Culoarea iconiței |
| Href | string | - | URL-ul pentru navigare |
| ForceLoad | bool | false | Forțează reîncărcarea completă a paginii |
| Disabled | bool | false | Dezactivează elementul de meniu |
| DisableRipple | bool | false | Dezactivează efectul ripple |
| Command | ICommand | - | Comandă pentru pattern MVVM |
| CommandParameter | object | - | Parametru pentru comandă |
| TextStyle | string | - | Stiluri inline pentru text |

## Evenimente

### FodMenuItem

| Eveniment | Tip | Descriere |
|-----------|-----|-----------|
| OnClick | EventCallback<MouseEventArgs> | Eveniment declanșat la click pe element |

## Metode publice

Componentele nu expun metode publice.

## Componente asociate

- **FodMenuItem** - Element individual de meniu, trebuie folosit întotdeauna în interiorul unui FodMenu
- **FodIcon** - Folosit intern pentru afișarea iconițelor
- **NavLink** - Component Blazor folosit pentru navigare

## Stilizare

### Clase CSS generate

**FodMenu:**
- `.fod-navmenu` - Clasa de bază
- `.fod-navmenu-{color}` - Clase pentru culori (primary, secondary, etc.)

**FodMenuItem:**
- `.fod-nav-link-icon` - Clasa pentru iconiță
- `.fod-nav-link-icon-default` - Aplicată când culoarea este Default

### Personalizare

```css
/* Schimbarea culorii de fundal a meniului */
.sidebar {
    background-color: #2c3e50;
}

/* Modificarea stilului hover pentru elemente */
.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Ajustarea animației pentru butonul de toggle */
.colapse-button {
    transition: all 0.3s ease;
}
```

## Note și observații

1. **Animații fluide** - Meniul include animații pentru tranziția între stările deschis/închis
2. **Responsive** - Textul elementelor de meniu se ascunde/afișează automat în funcție de starea meniului
3. **Hamburgher menu** - Butonul de toggle se transformă într-un X când meniul este deschis
4. **Cascading value** - FodMenu transmite referința sa către FodMenuItem prin CascadingValue

## Bune practici

1. **Iconițe consistente** - Folosiți iconițe din aceeași familie pentru o experiență vizuală uniformă
2. **Organizare logică** - Grupați elementele de meniu în mod logic
3. **Feedback vizual** - Asigurați-vă că elementul activ este evidențiat vizual
4. **Accesibilitate** - Adăugați atribute ARIA pentru cititorii de ecran când este necesar
5. **Performanță** - Pentru meniuri mari, considerați lazy loading pentru secțiuni

## Concluzie

Componentele FodMenu și FodMenuItem oferă o soluție completă pentru navigarea laterală în aplicații. Cu suport pentru animații, culori personalizabile și integrare perfectă cu sistemul de routing Blazor, acestea permit crearea de interfețe de navigare moderne și intuitive.