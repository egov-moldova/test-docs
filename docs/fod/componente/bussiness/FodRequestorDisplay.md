# FodRequestorDisplay Component Documentation

## Descriere Generală

`FodRequestorDisplay` este un component Razor folosit pentru afișarea datelor solicitantului într-un format structurat, utilizând `FodDisplay`. Acesta afișează condiționat câmpuri din modelul `IRequestor`, cum ar fi IDNP, nume complet, IDNO, denumirea companiei, email, telefon etc., în funcție de tipul solicitantului (persoană fizică sau juridică) și de configurările de afișare.

---

## Proprietăți

| Proprietate | Tip | Descriere |
|------------|-----|-----------|
| `Model` | `IRequestor` | Modelul de date al solicitantului, pe baza căruia se face afișarea câmpurilor. |
| `PropertyExcluded(string)` | `Func<string, bool>` | Metodă moștenită folosită pentru a verifica dacă o proprietate este exclusă din afișare. |

---

## Funcționalități

- Afișează tipul solicitantului (`RequestorType`) mereu dacă nu este exclus.
- Afișează `RequestorIdno` și `RequestorCompanyName` doar dacă tipul este `Organization`.
- Afișează `RequestorIdnp`, `FullName`, `RequestorPhone`, `RequestorEmail` și `MPowerAuthorization` doar dacă nu sunt nule/gole și nu sunt excluse.
- Folosește `FodDisplay` pentru fiecare câmp, ceea ce presupune o afișare uniformizată în aplicație.
- Eticheta pentru `MPowerAuthorization.AuthorizingPartyName` este determinată dinamic prin metoda `GetAuthorizingPartyNameLabel()`.

---

## Dependențe Injectate

| Serviciu | Descriere |
|----------|-----------|
| `IStringLocalizer<FodSharedResources>` | Utilizat pentru localizarea etichetelor afișate în componentă. |

---

## Observații

Această componentă este utilă pentru afișarea într-un mod controlat și localizat a datelor despre solicitant în interfața de utilizator. Afișarea câmpurilor se face condiționat, oferind flexibilitate mare prin metoda `PropertyExcluded`.