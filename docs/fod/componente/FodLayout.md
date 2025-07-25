# FodLayout
**Documentație componentă layout pentru aplicațiile FOD**

## Descriere generală
`FodLayout` este o componentă fundamentală pentru aplicațiile care folosesc biblioteca FOD. Aceasta oferă contextul necesar funcționării corecte a tuturor componentelor FOD și trebuie inclusă în `MainLayout.razor` sau în layout-ul principal al aplicației.

## Rolul `FodLayout`
- Oferă un **provider global pentru notificări** și mesaje informative.
- Încarcă și gestionează **configurațiile aplicației** (de exemplu, limba, temele vizuale).
- Interceptează și propagă contextul aplicației către componentele copil (de exemplu, pentru localizare, autentificare, etc.).
- Este responsabilă pentru inițializarea contextelor globale de UI (popover, dialoguri, snackbar, tooltips etc.).

## Utilizare recomandată
Include `FodLayout` în `MainLayout.razor`, astfel încât toate paginile și componentele să beneficieze de infrastructura sa:

```razor
@inherits LayoutComponentBase

<FodLayout>
    @Body
</FodLayout>
```

> ⚠️ Dacă `FodLayout` nu este utilizat, componente precum `FodDatePicker`, `FodSnackbar`, `FodDialog` sau `FodAppInitializer` pot să nu funcționeze corect.

## Alternative
Dacă `FodLayout` nu este utilizat ca layout principal, este obligatoriu să incluzi următoarele componente manual în layout-ul propriu:

```razor
<FodPopoverProvider />
<FodAppInitializer />
<FodSnackbarProvider />
```

Dar aceasta este o abordare avansată și este recomandat **să se utilizeze `FodLayout`** ca root layout pentru o integrare completă și corectă.

## Concluzie
Pentru a asigura funcționalitatea completă a bibliotecii FOD, `FodLayout` trebuie să fie parte din arhitectura principală a aplicației. Include-l în `MainLayout.razor` pentru o experiență unitară, stabilă și complet funcțională.
