# FodDeliveryDisplay

## Descriere Generală

Componenta `FodDeliveryDisplay` este utilizată pentru afișarea informațiilor despre livrarea documentelor prin servicii de curierat. Oferă o vizualizare structurată și clară a detaliilor de livrare, incluzând transportatorul, numărul de urmărire și data estimată de livrare.

Componenta este ideală pentru afișarea statusului de livrare în paginile de detalii ale solicitărilor sau în secțiunile de urmărire a comenzilor.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodDeliveryDisplay Model="@deliveryInfo" />

@code {
    private FodDeliveryModel deliveryInfo = new()
    {
        CarrierName = "DHL Express",
        TrackingId = "1234567890",
        CarrierEstimatedDeliveryEnd = DateTime.Now.AddDays(3)
    };
}
```

### Integrare în pagină de detalii

```razor
<div class="request-details">
    <h3>Informații solicitare</h3>
    
    <!-- Detalii solicitare -->
    <FodRequestorDisplay Model="@requestor" />
    
    <!-- Informații livrare -->
    @if (hasDelivery)
    {
        <FodDeliveryDisplay Model="@deliveryModel" />
    }
    
    <!-- Status solicitare -->
    <FodRequestStatus Status="@status" />
</div>
```

### Gestionare model null

```razor
<!-- Componenta gestionează automat cazul când Model este null -->
<FodDeliveryDisplay Model="@nullableDeliveryModel" />

@code {
    private FodDeliveryModel? nullableDeliveryModel = null;
    // Va afișa mesaj de eroare localizat
}
```

### Exemplu cu date complete

```razor
<FodDeliveryDisplay Model="@completeDeliveryInfo" />

@code {
    private FodDeliveryModel completeDeliveryInfo = new()
    {
        CarrierName = "Posta Moldovei",
        TrackingId = "RM123456789MD",
        CarrierEstimatedDeliveryEnd = DateTime.Now.AddDays(5)
    };
}
```

## Atribute disponibile

| Atribut | Tip | Valoare implicită | Descriere |
|---------|-----|-------------------|-----------|
| Model | FodDeliveryModel | null | Modelul cu informațiile de livrare |

### Proprietăți FodDeliveryModel

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| CarrierName | string | Numele transportatorului/curierului |
| TrackingId | string | Numărul de urmărire a coletului |
| CarrierEstimatedDeliveryEnd | DateTime? | Data estimată pentru finalizarea livrării |

## Evenimente

Componenta nu expune evenimente.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodCardWrapper** - Container pentru afișarea într-un card cu titlu și iconiță
- **FodDisplay** - Component generic pentru afișarea câmpurilor formatate
- **FodAlert** - Pentru afișarea mesajelor de eroare când modelul lipsește

## Stilizare

Componenta folosește stilurile standard ale componentelor FOD și Bootstrap.

### Structura vizuală

```
┌─────────────────────────────────────┐
│ 🚚 Informații livrare              │
├─────────────────────────────────────┤
│ Transportator: DHL Express          │
│ Număr urmărire: 1234567890          │
│ Data estimată: 20.01.2024           │
└─────────────────────────────────────┘
```

### Personalizare

```css
/* Ajustarea spațierii cardului */
.fod-delivery-display .fod-card-wrapper {
    margin-bottom: 1.5rem;
}

/* Stilizare pentru câmpurile de date */
.fod-delivery-display dl.row {
    margin-bottom: 0;
}

/* Evidențierea numărului de urmărire */
.fod-delivery-display [data-field="TrackingId"] {
    font-family: monospace;
    font-weight: bold;
}
```

## Note și observații

1. **Gestionare null** - Componenta afișează un mesaj de eroare localizat când Model este null
2. **Localizare completă** - Toate textele și etichetele sunt localizate
3. **Format read-only** - Componenta este doar pentru vizualizare
4. **Iconiță tematică** - Folosește o iconiță de livrare pentru identificare vizuală rapidă
5. **Card wrapper** - Încapsulată în FodCardWrapper pentru consistență vizuală

## Bune practici

1. **Validare date** - Verificați că modelul conține date valide înainte de afișare
2. **Format tracking ID** - Păstrați formatul original al numărului de urmărire
3. **Actualizare status** - Actualizați periodic informațiile de livrare
4. **Context complet** - Folosiți împreună cu alte componente de afișare pentru context
5. **Tratare erori** - Gestionați cazurile când serviciul de livrare nu returnează date

## Concluzie

FodDeliveryDisplay oferă o modalitate simplă și elegantă de a afișa informațiile de livrare. Cu suport pentru localizare, gestionare automată a erorilor și design consistent, componenta se integrează perfect în fluxurile de urmărire a solicitărilor.