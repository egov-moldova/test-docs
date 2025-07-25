# Footer  
**Documentație Componente Blazor – `FODFooter` & `FodFooterColumnLink`**

---

## 1. FODFooter

### Descriere  
`FODFooter` este o componentă Blazor care afișează un footer configurabil pentru aplicațiile FOD. Aceasta permite personalizarea cu numele organizației, linkuri către rețele sociale, numere de telefon și alte informații utile.

### Proprietăți

| Nume                    | Tip                     | Descriere                                                  | Implicit                                                 |
|-------------------------|--------------------------|-------------------------------------------------------------|----------------------------------------------------------|
| organizationName        | `string`                | Numele organizației afișat în footer.                      | "Guvernul Republicii Moldova"                           |
| Facebook                | `string`                | URL către pagina de Facebook.                              | `null`                                                   |
| OrganizationLink        | `string`                | URL către pagina oficială a organizației.                  | `null`                                                   |
| Twitter                 | `string`                | URL către profilul Twitter.                                | `null`                                                   |
| LinkedIn                | `string`                | URL către profilul LinkedIn.                               | `null`                                                   |
| Instagram               | `string`                | URL către profilul Instagram.                              | `null`                                                   |
| phoneNumber             | `string`                | Numărul de telefon principal.                              | "022 820 000"                                            |
| technicalPhoneNumber    | `string?`               | Numărul de telefon pentru suport tehnic.                   | `null`                                                   |
| Email                   | `string`                | Adresa de email de contact.                                | `null`                                                   |
| copyright               | `string`                | Textul de copyright afișat în footer.                      | "© Copyright. Agenția de Guvernare Electronică {Anul curent}" |
| Logo                    | `string`                | URL-ul logo-ului afișat în footer.                         | `null`                                                   |
| isCompact               | `bool`                  | Activează modul compact pentru containerul footerului.     | `false`                                                  |
| IsContainered           | `bool`                  | Specifică dacă footerul este limitat la max-width 1600px.  | `false`                                                  |
| PhoneNumbers            | `IEnumerable<string>`   | Listă de numere de telefon afișate în footer.              | `null`                                                   |
| ChildContent            | `RenderFragment`        | Conținut personalizat afișat în footer.                    | `null`                                                   |
| FooterFirstColumnChildContent | `RenderFragment` | Conținut specific pentru prima coloană a footerului.       | `null`                                                   |

### Metode

| Nume                         | Descriere                                                              |
|------------------------------|-------------------------------------------------------------------------|
| `AddColumn(FodFooterColumnLink columnLink)` | Adaugă un obiect de tip `FodFooterColumnLink` în lista de coloane din footer. |

---

## 2. FodFooterColumnLink

### Descriere  
`FodFooterColumnLink` este o componentă utilizată pentru a defini coloane de linkuri afișate în footer.

### Proprietăți

| Nume         | Tip                          | Descriere                                                |
|--------------|-------------------------------|-----------------------------------------------------------|
| Parent       | `FODFooter`                   | Referință la componenta părinte `FODFooter`.              |
| Name         | `string`                      | Numele coloanei afișat în footer.                         |
| Links        | `Dictionary<string, string>`  | Dicționar care conține linkuri (text -> URL).            |
| ChildContent | `RenderFragment`              | Conținut personalizat afișat în coloană.                  |

---

## 3. Exemplu de utilizare

```razor
<FODFooter Facebook="facebook.com" LinkedIn="LinkedIn" phoneNumber="025006569" 
           PhoneNumbers="@(new string[]{ "Test 2002000", "another test 200020000 2000" })" 
           Email="suport.fod@egov.md" OrganizationLink="https://gov.md/" 
           technicalPhoneNumber="034345151">

    <FodFooterColumnLink>
        <div class="col links-group pl-0">
            <h4 class="group-title">First Column Name</h4>
            <ul>
                <li>
                    <a href="Facebook.com">Pagina de Facebook</a>
                </li>
            </ul>
        </div>
    </FodFooterColumnLink>

    <FodFooterColumnLink>
        <div class="col links-group pl-0">
            <h4 class="group-title">Second Column Name</h4>
            <ul>
                <li>
                    <a href="Facebook.com">Pagina de Facebook</a>
                </li>
            </ul>
        </div>
    </FodFooterColumnLink>

    <FodFooterColumnLink>
        <div class="col links-group pl-0">
            <h4 class="group-title">Third Column Name</h4>
            <ul>
                <li>
                    <a href="Facebook.com">Pagina de Facebook</a>
                </li>
            </ul>
        </div>
    </FodFooterColumnLink>

</FODFooter>
```

---

## Explicație
- `FODFooter` include diverse informații despre organizație, linkuri sociale și contacte.  
- `FodFooterColumnLink` sunt utilizate pentru a structura footer-ul în mai multe coloane.  
- Fiecare coloană conține un titlu (`h4`) și o listă de linkuri (`ul > li > a`).
