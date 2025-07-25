# Documentație pentru Interfața `IRequestor`

## Descriere Generală

`IRequestor` este o interfață care definește structura de bază a unui solicitant (persoană fizică sau juridică) utilizat în cadrul aplicațiilor FOD. Aceasta oferă toate atributele necesare pentru identificarea și contactarea solicitantului, precum și detalii despre modul înce care acesta acționează (în nume propriu sau în numele altei entități).

---

## Proprietăți

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `RequestorType` | `PersonType` | Tipul solicitantului: persoană fizică sau organizație. |
| `RequestorIdnp` | `string?` | Codul numeric personal (IDNP) al solicitantului. Relevant pentru persoane fizice. |
| `RequestorIdno` | `string?` | Codul de înregistrare al organizației (IDNO). Relevant pentru persoane juridice. |
| `RequestorFirstName` | `string?` | Prenumele solicitantului. |
| `RequestorLastName` | `string?` | Numele de familie al solicitantului. |
| `RequestorCompanyName` | `string?` | Denumirea organizației solicitante. |
| `RequestorPhone` | `string?` | Numărul de telefon al solicitantului. |
| `RequestorEmail` | `string?` | Adresa de email a solicitantului. |
| `MPowerAuthorizationNumber` | `string?` | Numărul autorizației MPower (dacă este cazul). |
| `OnBehalfOn` | `OnBehalfOnEnum` | Specifică dacă solicitantul acționează în nume propriu sau în numele altuia. |
| `MPowerAuthorization` | `MPowerAuthorization?` | Obiectul care conține detalii despre autorizația MPower. |
| `RequestorStatuteModel` | `FodRequestorStatuteModel` | Informații despre statutul legal al solicitantului (ex. reprezentant legal, delegat etc.). |
| `FullName` *(readonly)* | `string?` | Numele complet al solicitantului, compus din `RequestorFirstName` și `RequestorLastName`. |

---

## Enum: `OnBehalfOnEnum`

| Valoare | Descriere |
|--------:|-----------|
| `Personal (1)` | Solicitantul acționează în nume propriu. |
| `MPowerAuthorization (2)` | Solicitantul acționează în baza unei autorizații MPower. |
| `Custom (3)` | Alt tip de reprezentare (definit de implementare). |

---

## Observații

- Această interfață este folosită extensiv în componentele vizuale și în serviciile backend pentru a reprezenta datele unui solicitant.
- Proprietatea `FullName` este doar cu get și returnează concatenarea prenumelui și numelui de familie.
- Enum-ul `OnBehalfOnEnum` este localizat, ceea ce înseamnă că etichetele sale sunt afișate în funcție de resursele de localizare definite.

---

# Documentație pentru Clasa `FodRequestorModel`

## Descriere Generală

`FodRequestorModel` este o implementare a interfeței `IRequestor` care definește modelul complet al unui solicitant în aplicațiile FOD. Clasa include atât validări personalizate cât și suport pentru localizare prin atributele `Display` și `Required`.

---

## Proprietăți

| Proprietate | Tip | Descriere |
|-------------|-----|-----------|
| `RequestorType` | `PersonType` | Tipul solicitantului (persoană fizică sau organizație). Implicit este `Individual`. |
| `RequestorIdnp` | `string?` | Codul numeric personal. Este obligatoriu și validat cu atributul `[IDNP]`. |
| `RequestorIdno` | `string?` | Codul de înregistrare al organizației. Este obligatoriu doar pentru persoane juridice. |
| `RequestorCompanyName` | `string?` | Denumirea companiei. Este obligatorie pentru persoane juridice. |
| `RequestorFirstName` | `string?` | Prenumele solicitantului. Este obligatoriu. |
| `RequestorLastName` | `string?` | Numele de familie al solicitantului. Este obligatoriu. |
| `IsRequestorPhoneRequired` | `bool` | Indică dacă telefonul este obligatoriu. |
| `RequestorPhone` | `string?` | Număr de telefon. Devine obligatoriu dacă `IsRequestorPhoneRequired` este `true`. |
| `IsRequestorEmailRequired` | `bool` | Indică dacă emailul este obligatoriu. |
| `RequestorEmail` | `string?` | Adresă email. Devine obligatorie dacă `IsRequestorEmailRequired` este `true`. |
| `MPowerAuthorizationNumber` | `string?` | Numărul autorizației MPower, dacă este aplicabil. |
| `OnBehalfOn` | `OnBehalfOnEnum` | Indică dacă acționează în nume propriu, prin MPower sau custom. |
| `FullName` *(readonly)* | `string?` | Returnează numele complet: `Prenume + Nume`. |
| `MPowerAuthorization` | `MPowerAuthorization?` | Detalii despre autorizația MPower selectată. |
| `HasMultipleRequestorStatute` | `bool` | Specifică dacă sunt disponibile mai multe statute de solicitant. |
| `RequestorStatuteModel` | `FodRequestorStatuteModel` | Modelul ce descrie statutul solicitantului. Obligatoriu dacă există mai multe statute. |

---

## Validări

- `RequestorIdnp`, `RequestorFirstName`, `RequestorLastName` sunt întotdeauna obligatorii.
- `RequestorIdno` și `RequestorCompanyName` sunt obligatorii doar dacă `RequestorType` este `Organization`.
- `RequestorPhone` și `RequestorEmail` sunt condiționat obligatorii pe baza proprietăților `IsRequestorPhoneRequired` și `IsRequestorEmailRequired`.
- `RequestorStatuteModel` este obligatoriu dacă `HasMultipleRequestorStatute` este `true`.

---

## Observații

- Clasa utilizează atributul `[RequiredIf]` pentru a permite validări condiționale flexibile.
- Localizarea este realizată prin atributele `Display` și `ErrorMessageResourceName` care se bazează pe `FodSharedResources`.
- Această clasă este utilizată în mod direct în formulare pentru introducerea datelor despre solicitant.