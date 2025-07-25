# FodServiceRequestStatus

## Descriere Generală

Componenta `FodServiceRequestStatus` oferă o interfață pentru verificarea statusului solicitărilor de servicii publice folosind numărul de comandă. Permite utilizatorilor să introducă un număr de comandă și să vizualizeze informații detaliate despre status, data depunerii și data estimată de finalizare.

Componenta funcționează împreună cu `FodServiceRequestStatusResponse` pentru a oferi o experiență completă de verificare a statusului.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodServiceRequestStatus />
```

### Cu număr de comandă predefinit

```razor
<FodServiceRequestStatus OrderNumber="SR-2024-001234" />

@code {
    // Componenta va pre-completa câmpul cu numărul furnizat
}
```

### Integrare în pagină dedicată

```razor
@page "/verifica-status"

<div class="container mt-4">
    <h2>Verificare Status Solicitare</h2>
    <p>Introduceți numărul de comandă pentru a verifica statusul solicitării dvs.</p>
    
    <FodServiceRequestStatus />
</div>
```

### Exemplu în modal

```razor
<FodModal @ref="statusModal" Title="Verificare Status">
    <Content>
        <FodServiceRequestStatus />
    </Content>
</FodModal>

<FodButton OnClick="@(() => statusModal.Show())">
    Verifică Status Solicitare
</FodButton>

@code {
    private FodModal statusModal;
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| OrderNumber | string | null | Numărul de comandă pentru pre-completare |
| Class | string | - | Clase CSS adiționale |
| Style | string | - | Stiluri inline |

## Evenimente

Componenta nu expune evenimente publice.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodServiceRequestStatusResponse** - Afișează răspunsul primit de la serviciu
- **FodLoadingLinear** - Indicator de încărcare în timpul verificării
- **FodButton** - Buton pentru declanșarea verificării
- **FodDisplay** - Pentru afișarea câmpurilor de răspuns

## Stilizare

### Clase CSS

- `.search-box` - Container principal cu umbră și colțuri rotunjite
- `.form-control` - Stilizare pentru câmpul de input
- `.text-danger` - Pentru mesajele de eroare

### Personalizare

```css
/* Stilizare container principal */
.search-box {
    padding: 2rem;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
}

/* Ajustare câmp input */
.search-box .form-control {
    max-width: 400px;
    font-size: 1.1rem;
}

/* Spațiere buton */
.search-box .fod-button {
    margin-top: 1.5rem;
}

/* Stilizare mesaj eroare */
.search-box .text-danger {
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
```

## Note și observații

1. **Serviciu obligatoriu** - Necesită injectarea `IServiceRequestStatusService`
2. **Validare client-side** - Verifică că numărul de comandă este completat
3. **Loading state** - Afișează indicator de încărcare în timpul verificării
4. **Răspuns încapsulat** - Folosește FodServiceRequestStatusResponse pentru afișare
5. **Localizare** - Toate textele sunt localizate prin `IStringLocalizer`

## Bune practici

1. **Gestionare erori** - Implementați tratarea erorilor de rețea/serviciu
2. **Format număr** - Validați formatul numărului de comandă înainte de trimitere
3. **Feedback vizual** - Păstrați indicatorul de încărcare pentru operații lungi
4. **Cache rezultate** - Considerați cache-uirea rezultatelor pentru performanță
5. **Instrucțiuni clare** - Oferiți exemple de format pentru numărul de comandă

## Concluzie

FodServiceRequestStatus oferă o interfață simplă și intuitivă pentru verificarea statusului solicitărilor. Cu validare integrată, feedback vizual și suport pentru localizare, componenta facilitează procesul de urmărire a solicitărilor pentru utilizatori.