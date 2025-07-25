# FodApostilaDisplay

## Descriere Generală

Componenta `FodApostilaDisplay` este utilizată pentru afișarea detaliilor unei solicitări de apostilare existente. Spre deosebire de `FodApostila` care permite crearea/editarea unei solicitări, această componentă este optimizată pentru vizualizarea informațiilor într-un format read-only, elegant și structurat.

Componenta afișează toate detaliile relevante despre apostilare într-un card formatat, incluzând țara de destinație, termenul de execuție și data estimată de finalizare.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodApostilaDisplay Model="@apostilaModel" />

@code {
    private FodApostilaModel apostilaModel = new()
    {
        RequiresApostilation = true,
        Country = new FodApostilaCountryModel { Name = "Germania" },
        ExecutionTerm = new FodApostilaExecutionTermModel { Text = "Standard (5 zile)" },
        EstimateResolveDate = DateTime.Now.AddDays(5)
    };
}
```

### Afișare condiționată

```razor
@if (requestDetails?.ApostilaInfo != null)
{
    <FodApostilaDisplay Model="@requestDetails.ApostilaInfo" />
}
```

### Integrare în pagină de detalii

```razor
<div class="request-details">
    <h3>Detalii solicitare</h3>
    
    <!-- Alte informații despre solicitare -->
    <FodRequestorDisplay Model="@requestor" />
    
    <!-- Informații apostilare -->
    @if (hasApostilation)
    {
        <FodApostilaDisplay Model="@apostilaInfo" />
    }
    
    <!-- Status solicitare -->
    <FodRequestStatus Status="@requestStatus" />
</div>
```

### Exemplu fără apostilare

```razor
<FodApostilaDisplay Model="@noApostilaModel" />

@code {
    private FodApostilaModel noApostilaModel = new()
    {
        RequiresApostilation = false
    };
    // Va afișa doar "Necesită apostilare: Nu"
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Model | FodApostilaModel | - | Modelul cu datele de apostilare de afișat (obligatoriu) |

## Evenimente

Componenta nu expune evenimente.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodCardWrapper** - Wrapper pentru afișarea într-un card cu titlu și iconiță
- **FodDisplay** - Component generic pentru afișarea câmpurilor
- **FodAlert** - Pentru afișarea notei despre actualizarea termenelor

## Stilizare

Componenta folosește stilurile standard ale componentelor FOD și Bootstrap pentru layout.

### Structura vizuală

```
┌─────────────────────────────────────┐
│ 📋 Solicitare apostilare           │
├─────────────────────────────────────┤
│ Necesită apostilare: Da            │
│ Țara: Germania                      │
│ Termen execuție: Standard (5 zile)  │
│ Data estimată: 15.01.2024           │
│                                     │
│ ⚠️ Notă despre termene...          │
└─────────────────────────────────────┘
```

### Personalizare

```css
/* Modificarea aspectului cardului */
.fod-card-wrapper {
    margin-bottom: 1.5rem;
}

/* Stilizare pentru definition list */
.fod-apostila-display dl.row {
    margin-bottom: 0.5rem;
}

/* Ajustarea alertei de avertizare */
.fod-apostila-display .fod-alert-warning {
    margin-top: 1rem;
    font-size: 0.9rem;
}
```

## Note și observații

1. **Read-only** - Componenta este doar pentru vizualizare, nu permite editare
2. **Afișare condiționată** - Afișează doar câmpurile relevante când apostilarea este activă
3. **Localizare** - Toate textele sunt localizate prin `IStringLocalizer<FodSharedResources>`
4. **Card wrapper** - Include automat titlu și iconiță specifică
5. **Avertizare dinamică** - Nota despre termene apare doar când apostilarea este activă

## Bune practici

1. **Verificare model** - Verificați că Model nu este null înainte de utilizare
2. **Date complete** - Asigurați-vă că modelul conține toate informațiile necesare
3. **Context vizual** - Folosiți în combinație cu alte componente Display pentru context complet
4. **Spațiere** - Lăsați spațiu adecvat între componente pentru claritate vizuală

## Concluzie

FodApostilaDisplay oferă o modalitate elegantă și consistentă de a afișa informațiile despre apostilare. Cu formatare automată, localizare completă și design responsive, componenta se integrează perfect în paginile de detalii ale solicitărilor.