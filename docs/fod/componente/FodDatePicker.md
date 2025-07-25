# Date Picker  
**Documentație Componente Razor: `FodDatePicker` și `FodDateRangePicker`**  
**Namespace:** `Fod.Components`

---

## 1. FodDatePicker

### Descriere
`FodDatePicker` este o componentă de tip *date picker* care permite selectarea unei singure date. Derivă din `FodBaseDatePicker`, care implementează logica comună pentru interfața calendarului și comportamentul picker-ului.

> ⚠️ Pentru ca `FodDatePicker` să funcționeze corect, componenta trebuie să fie generată în interiorul unui `FodLayout` **sau** să fie adăugat manual `<FodPopoverProvider></FodPopoverProvider>` în layout-ul aplicației.

### Proprietăți principale

| Proprietate        | Tip                      | Descriere                                                      |
|--------------------|---------------------------|-----------------------------------------------------------------|
| Date               | `DateTime?`              | Data selectată (binding bidirecțional).                        |
| DateChanged        | `EventCallback<DateTime?>` | Eveniment invocat când data se modifică.                     |
| OnDateChanged      | `EventCallback<DateTime?>` | Eveniment suplimentar la modificarea datei.                   |
| DateFormat         | `string`                 | Formatul de afișare a datei.                                   |
| MinDate / MaxDate  | `DateTime?`              | Limite inferioare și superioare pentru selecție.               |
| FixYear/FixMonth/FixDay | `int?`              | Fixează un an, lună sau zi (nu pot fi selectate alte valori). |
| AutoClose          | `bool`                   | Închide automat picker-ul după selecție.                       |
| IsDateDisabledFunc | `Func<DateTime, bool>`   | Funcție care dezactivează anumite zile.                        |

### Funcționalități
- Suportă `OpenTo` (deschiderea la nivel de an/lună/zi).  
- Navigare cu tastatura (Enter, Escape, Space, săgeți).  
- **Metode publice**:
  - `GoToDate()`  
  - `GoToDate(DateTime, bool)` – setează luna curentă.  
  - `Clear()` – șterge data selectată.  
  - `Submit()` – finalizează selecția.  

---

## 2. FodDateRangePicker

### Descriere
`FodDateRangePicker` permite selectarea unui interval de date (*de la – până la*). Moștenește `FodBaseDatePicker` și gestionează logica suplimentară necesară pentru lucrul cu intervale.

### Proprietăți principale

| Proprietate      | Tip             | Descriere                                                    |
|------------------|------------------|---------------------------------------------------------------|
| DateRange        | `DateRange`      | Intervalul selectat (binding bidirecțional).                  |
| DateRangeChanged | `EventCallback<DateRange>` | Eveniment invocat când intervalul se modifică.     |
| MinDate/MaxDate  | `DateTime?`      | Limite inferioare și superioare pentru selecție.              |
| DisplayMonths    | `int`            | Numărul de luni afișate simultan (implicit 2).                |

### Funcționalități
- Selectarea se face în 2 pași: primul click setează `Start`, al doilea `End`.  
- Dacă selecția este invalidă (conține zile dezactivate), este ignorată.  
- **Metode publice pentru control text:**
  - `FocusStartAsync()` / `FocusEndAsync()`  
  - `SelectStartAsync()` / `SelectEndAsync()`  
  - `SelectRangeStartAsync()` / `SelectRangeEndAsync()`  
- Suportă formatare customizabilă (`DateFormat`) și conversie `string ↔ DateRange`.

---

## 3. Clasa `DateRange`

### Descriere
Clasă model care definește un interval de tip `DateTime?`. Include metode pentru:
- Conversie la/din string (`ToIsoDateString()`, `TryParse(...)`)  
- Egalitate (`Equals`, operatori `==`, `!=`)  
- Suport `RangeConverter`

---

## 4. Componente interne & utilitare

- `FodBaseDatePicker`: Clasă abstractă cu funcționalitate comună picker-urilor:
  - Navigare lună/an
  - Customizare: icoane, formate, cultură
  - `OpenTo`, `CurrentView`, `DisplayMonths`, `TitleDateFormat`

- `Range<T>`: Model generic pentru intervale (folosit în `DateRange`).
- `Converter<T>`: Obiect care convertește între `T` și `string`, cu erori și formatare.
- `CssBuilder`: Utilitar pentru compunerea dinamică a claselor CSS.

---

## 5. UI/UX
- Săptămâna începe conform culturii (`FirstDayOfWeek`).
- Suport pentru afișare numere săptămâni (`ShowWeekNumbers`).
- Stiluri aplicate condiționat prin funcții delegate:
  - `IsDateDisabledFunc`
  - `AdditionalDateClassesFunc`

---

## 6. Exemple de utilizare

```razor
<FodDatePicker @bind-Date="selectedDate"
               MinDate="DateTime.Today"
               MaxDate="DateTime.Today.AddYears(1)"
               DateFormat="dd.MM.yyyy"
               AutoClose="true" />

<FodDateRangePicker @bind-DateRange="selectedRange"
                    DisplayMonths="2"
                    DateFormat="yyyy-MM-dd" />
```
