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
