#Referință API

##**Procesarea plății online**

În cazul plății online (card not present, ecommerce), prestatorul de servicii trebuie să redirecționeze browserul către pagina de plată a MPay. WEB serviciul va comunica prin protocolul standard HTTP (HTTP / 1.1) și va acorda permisiunea de acces pentru IP-ul clientului (doar pe mediul test).
Descrierea parametrilor implicați în această redirecționare.

<table>
  <tbody>
    <tr>
      <th>Metoda</th>
      <td>POST</td>
    </tr>
    <tr>
      <th>URL</th>
      <td>
        Test <a href="https://testmpay.gov.md/service/pay" target="_blank">https://testmpay.gov.md/service/pay</a><br>
        Prod <a href="https://mpay.gov.md/service/pay" target="_blank">https://mpay.gov.md/service/pay</a>
      </td>
    </tr>
    <tr>
      <th>Descriere</th>
      <td>Utilizatorul efectuează plata online direct (card (card not present - ecommerce), Apple Pay, Google Pay, Instant payment (MIA), internet banking, e-money)
        sau să acceseze instrucțiunile altor metode de plată.</td>
    </tr>
  </tbody>
</table>

**Forma sau parametrii URL**

<table>
  <thead>
    <tr>
      <th>Nume</th>
      <th>Tip</th>
      <th>Obligatoriu/Opțional</th>
      <th>Descriere</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ServiceID</td>
      <td>string</td>
      <td>Obligatoriu</td>
      <td>Identificatorul serviciului în MPay</td>
    </tr>
    <tr>
      <td>OrderKey</td>
      <td>string</td>
      <td>Obligatoriu</td>
      <td>
        Indentificatorul comenzii la prestatorul de serviciu. Aceasta trebuie să fie generat în mod unic pentru
        fiecare comandă (cum ar fi cheia primară sau alt tip de număr de referință).
      </td>
    </tr>
    <tr>
      <td>ReturnUrl</td>
      <td>URL</td>
      <td>Opțional</td>
      <td>
        Adresa URL pe care MPay va redirecționa plătitorul după plata comenzii reușită. Această pagină va fi redirecționată
        prin metoda GET HTTP/S. Asigurați-vă că codificați URL-ul pentru orice parametri pe care îi utilizați pentru a crea această adresă URL.
      </td>
    </tr>
  </tbody>
</table>

##**Reguli de tratare a erorilor**

Erorile rezultate la apelarea interfeței SOAP, MPay se așteaptă la tipul de erori **SOAP faults** cu **fault code** și **fault reason** care sunt descrise în limba engleză. Traducerea erorilor în limba română este opțională. Dacă nu există nici o eroare SOAP returnată de la prestatorul de servicii, MPay consideră că aplearea operațiunii s-a finalizat cu succes, ceea ce înseamnă că tranzacția este validă.

<table>
  <thead>
    <tr>
      <th>Fault Code</th>
      <th>Descriere</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>InternalError</td>
      <td>Eroare internă neașteptată</td>
    </tr>
    <tr>
      <td>AuthenticationFailed</td>
      <td>Procesul de autentificare a consumatorului de web serviciu a eșuat. Consultați Autentificarea</td>
    </tr>
    <tr>
      <td>AuthorizationFailed</td>
      <td>Procesul de autorizare a consumatorului de web serviciu a eșuat. Vezi Eroarea! Sursa de referință nu a fost găsită</td>
    </tr>
    <tr>
      <td>InvalidParameter</td>
      <td>Parametru de intrare este nevalid. Examinați textul Motivului (fault result) returnat și descrierea operațiunii apelate</td>
    </tr>
    <tr>
      <td>UnknownService</td>
      <td>ServiceID-ul nu coincide cu cel al prestatorului de serviciu</td>
    </tr>
    <tr>
      <td>UnknownOrder</td>
      <td>Identificatorul comenzii la prestatorul de serviciu este necunoscut</td>
    </tr>
    <tr>
      <td>UnknownInvoice</td>
      <td>InvoiceID-ul este necunoscut</td>
    </tr>
    <tr>
      <td>UknownPayment</td>
      <td>PaymentID-ul este necunoscut</td>
    </tr>
    <tr>
      <td>InvoiceAlreadyPaid</td>
      <td>Nota de plată MPay cu indentificatorul căutat deține unele încasări și nu poate fi anulată</td>
    </tr>
    <tr>
      <td>InvoiceExpired</td>
      <td>Nota de plată MPay nu mai este valabilă și nu va fi achitată</td>
    </tr>
  </tbody>
</table>

##**Operațiunile idempotente**

Toate apelurile si structurile definite în **IServiceProvider** trebuie să fie idempotente, adică indiferent de numărul de apeluri cu aceleași parametri de intrare, rezultatul returnat și efectul de business al apelării nu trebuie să fie diferit.

##**Operațiunia GetOrderDetails**

<table>
  <tbody>
    <tr>
      <th><strong>Semnatura</strong></hd>
      <td colspan="3">GetOrderDetails(query: OrderDetailsQuery) :OrderDetails[]</td>
    </tr>
    <tr>
      <td><strong>Descrierea</strong></hd>
      <td colspan="3">Returnează detaliile comenzilor, potrivit parametrilor de intrare, din sistemul informațional al prestatorului de servicii</td>
    </tr>
    <tr>
      <th><strong>Retur</strong></hd>
      <td colspan="3">Un șir de obiecte, de tip <strong>OrderDetails</strong>, conform criteriilor de căutare</td>
    </tr>
    <tr>
      <th><strong>Remarci</strong></th>
      <td colspan="3">Această metodă poate fi apelată de mai multe ori și în unele cazuri prestatorul de serviciu poate returna un rezultat diferit, cum ar fi valoarea din TotalAmountDue sau OrderStatus, pentru același număr comandă. Aceasta se poate întâmpla atunci când o comandă este modificată ulterior de către prestatorul de servicii. În acest caz MPay deține detaliile de plată conform ultimei căutări a comenzii la prestatorul de servicii, ca urmare suma sau statutul rămân neactualizată.</td>
    </tr>
  </tbody>
</table>

###**Parametrii de intrare**

<table>
  <thead>
    <tr>
      <th>Nume</th>
      <th>Tip</th>
      <th>Descriere</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>query</td>
      <td>OrderDetailsQuery</td>
      <td>O structură de date care conține criterii de interpelare a detaliilor comenzii</td>
    </tr>
  </tbody>
</table>

###**Erori**

<table>
  <thead>
    <tr>
      <th>Cod</th>
      <th>Motiv</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>InvalidParameter</td>
      <td>Un parametru de intrare este nevalid. Vă rugăm să oferiți detaliile corespunzătoare în <strong>Falut reason</strong>.</td>
    </tr>
    <tr>
      <td>UnknownService</td>
      <td>ServiceID-ul nu coincide cu cel a web serviciului</td>
    </tr>
  </tbody>
</table>


##**Operațiunia ConfirmOrderPayment**

<table>
  <tbody>
    <tr>
      <th><strong>Semnatura</strong></hd>
      <td colspan="3">ConfirmOrderPayment (confirmation:PaymentConfirmation)</td>
    </tr>
    <tr>
      <td><strong>Descrierea</strong></hd>
      <td colspan="3">Confirmă plata pentru comandă</td>
    </tr>
    <tr>
      <th><strong>Retur</strong></hd>
      <td colspan="3">Void</td>
    </tr>
    <tr>
      <th><strong>Remarci</strong></th>
      <td colspan="3">În unele cazuri, această metodă poate fi apelată de mai multe ori pentru aceeași plată (identificată în mod unic de proprietatea PaymentID). Asigurațivă că aceste apeluri nu vor produce dublări de plată pentru o singură comandă.</td>
    </tr>
  </tbody>
</table>

###**Parametrii de intrare**

<table>
  <thead>
    <tr>
      <th>Nume</th>
      <th>Tip</th>
      <th>Descriere</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Confirmation</td>
      <td>PaymentConfirmation</td>
      <td>O structură de date care descrie confirmarea plății</td>
    </tr>
  </tbody>
</table>

###**Erori**

<table>
  <thead>
    <tr>
      <th>Cod</th>
      <th>Motiv</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>InvalidParameter</td>
      <td>Un parametru de intrare este nevalid. Vă rugăm să oferiți detaliile corespunzătoare în <strong>Falut reason</strong>.</td>
    </tr>
    <tr>
      <td>UnknownService</td>
      <td>ServiceID-ul nu coincide cu cel a web serviciului</td>
    </tr>
    <tr>
      <td>UnknownOrder</td>
      <td>Identificatorul comenzii nu aparține web serviciului</td>
    </tr>
  </tbody>
</table>