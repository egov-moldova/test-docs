# FodContextProvider

## Descriere Generală

Componenta `FodContextProvider` este un wrapper simplu care încapsulează componenta `FodContextSelector`. Oferă o interfață simplificată pentru includerea funcționalității de selectare a contextului în aplicații, abstractizând complexitatea implementării.

## Ghid de Utilizare API

### Exemplu de bază

```razor
<FodContextProvider />
```

### Integrare în layout aplicație

```razor
@inherits LayoutComponentBase

<div class="page">
    <FodContextProvider />
    
    <div class="main">
        <FodHeader />
        
        <div class="content px-4">
            @Body
        </div>
    </div>
</div>
```

### În componenta App.razor

```razor
<Router AppAssembly="@typeof(App).Assembly">
    <Found Context="routeData">
        <FodContextProvider />
        <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
    </Found>
    <NotFound>
        <PageTitle>Not found</PageTitle>
        <LayoutView Layout="@typeof(MainLayout)">
            <p role="alert">Sorry, there's nothing at this address.</p>
        </LayoutView>
    </NotFound>
</Router>
```

## Atribute disponibile

Componenta nu expune atribute publice. Toate configurările sunt gestionate intern prin `FodContextSelector`.

## Evenimente

Componenta nu expune evenimente publice.

## Metode publice

Componenta nu expune metode publice.

## Componente asociate

- **FodContextSelector** - Componenta internă care gestionează întreaga logică de selectare context
- **IContextService** - Serviciul utilizat pentru gestionarea contextelor

## Stilizare

Componenta nu adaugă stiluri proprii. Toate stilurile sunt gestionate de `FodContextSelector`.

## Note și observații

1. **Wrapper component** - Această componentă servește doar ca punct de intrare
2. **Delegare completă** - Toată funcționalitatea este delegată către FodContextSelector
3. **Simplificare API** - Oferă o interfață mai simplă pentru dezvoltatori

## Bune practici

1. **Plasare strategică** - Includeți în layout-ul principal sau App.razor
2. **O singură instanță** - Folosiți doar o instanță per aplicație
3. **Servicii necesare** - Asigurați-vă că IContextService este înregistrat în DI

## Concluzie

FodContextProvider oferă o modalitate simplă de a integra funcționalitatea de selectare a contextului în aplicații. Prin abstractizarea complexității în FodContextSelector, dezvoltatorii pot adăuga această funcționalitate cu minim de configurare.