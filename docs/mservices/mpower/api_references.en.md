#Referințe API

##**Gestionarea erorilor**

!!! note "În atenția dvs."
    Componenta MPower Client API va returna erorile REST API cu codul și cauza erorii, descrierile se vor afișa în engleză.

<table>
  <thead>
    <tr>
      <th>Codul erorii</th>
      <th>Descriere</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AuthenticationFailed</td>
      <td>Service consumer authentication process failed. See Authentication</td>
    </tr>
    <tr>
      <td>InvalidParameter</td>
      <td>Some input parameter is invalid. Please review the returned Fault Reason text and called operation description.</td>
    </tr>
    <tr>
      <td>200</td>
      <td>Success</td>
    </tr>
    <tr>
      <td>400</td>
      <td>Bad request, Validation failed. Check validation rules compliance</td>
    </tr>
    <tr>
      <td>401</td>
      <td>Unauthorized Access. Check authorization requirements</td>
    </tr>
    <tr>
      <td>403</td>
      <td>Forbidden. The requested action is not allowed for the transmitted ID</td>
    </tr>
    <tr>
      <td>404</td>
      <td>Not found. Check sent request data</td>
    </tr>
    <tr>
      <td>500</td>
      <td>A server error occurred. Missing connection with DB from other reasons than: 400 / 401 / 501. Contact the Administrator.</td>
    </tr>
    <tr>
      <td>501</td>
      <td>A server error occurred. Contact the Administrator.</td>
    </tr>
  </tbody>
</table>

##**Descrierea metodelor API**

###**Verifică valabilitatea împuternicirii**

!!! note "În atenția dvs."
    Deoarece metoda poate fi apelată de mai multe ori în diferite zile/ore, răspunsul poate varia, căci la un anumit moment al apelării împuternicirea de reprezentare poate să nu fie valabilă ca urmare a expirării, revocării, renunțării, suspendării, etc.

<table>
  <thead>
    <tr>
      <th>Semnătura apelului</th>
      <th colspan="2">GET /api/Authorization/check/Code-True-One</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Descriere</strong></td>
      <td colspan="2">În baza codului împuternicirii de reprezentare se returnează o înscriere, care atestă dacă împuternicirea de reprezentare este valabilă sau anulată.</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Parametri de intrare/ieșire</strong></td>
    </tr>
     <tr>
      <td><strong>Denumire</strong></td>
      <td><strong>Tip</strong></td>
      <td><strong>Descriere</strong></td>
    </tr>
     <tr>
      <td><strong>Query</strong></td>
      <td>"authorizationCode"</td>
      <td>Codul unic de identificare al împuternicirii de reprezentare din 16 cifre.</td>
    </tr>
     <tr>
      <td><strong>Response</strong></td>
      <td>"data": =True sau False</td>
      <td>Dacă valoare returnată este True atunci împuternicirea de reprezentare este valabilă, dacă valoarea returnată este False atunci împuternicirea de reprezentare este nevalabilă.</td>
    </tr>
     <tr>
      <td colspan="3"><strong>Faults</strong></td>
    </tr>
     <tr>
      <td><strong>Code</strong></td>
      <td><strong>Reason</strong></td>
    </tr>
     <tr>
      <td>200</td>
      <td colspan="2">Success</td>
    </tr>
     <tr>
      <td>404</td>
      <td colspan="2">Not found. Check sent request data</td>
    </tr>
     <tr>
      <td>500</td>
      <td colspan="2">A server error occurred. Missing connection with DB from other reasons than: 400 / 401 / 501. Contact the Administrator.</td>
    </tr>
     <tr>
      <td>501</td>
      <td colspan="2">A server error occurred. Contact the Administrator.</td>
    </tr>
  </tbody>
</table>

###**Extrage datele împuternicirii**

<table>
  <thead>
    <tr>
      <th>Semnătura apelului</th>
      <th colspan="2">GET /api/Authorization/check/Code-Details-One</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Descriere</strong></td>
      <td colspan="2">În baza codului împuternicirii de reprezentare se returnează o înscriere, cu o structură de date despre detaliile împuternicirii de reprezentare identificate.</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Parametri de intrare/ieșire</strong></td>
    </tr>
     <tr>
      <td><strong>Denumire</strong></td>
      <td><strong>Tip</strong></td>
      <td><strong>Descriere</strong></td>
    </tr>
     <tr>
      <td><strong>Query</strong></td>
      <td>"authorizationCode"</td>
      <td>Codul unic de identificare al împuternicirii de reprezentare din 16 cifre.</td>
    </tr>
     <tr>
      <td><strong>Response</strong></td>
      <td>AuthorizationDetails</td>
      <td>O structură de date care conține detaliile împuternicirii de reprezentare identificate.</td>
    </tr>
     <tr>
      <td colspan="3"><strong>Faults</strong></td>
    </tr>
     <tr>
      <td><strong>Code</strong></td>
      <td><strong>Reason</strong></td>
    </tr>
     <tr>
      <td>200</td>
      <td colspan="2">Success</td>
    </tr>
     <tr>
      <td>404</td>
      <td colspan="2">Not found. Check sent request data</td>
    </tr>
     <tr>
      <td>500</td>
      <td colspan="2">A server error occurred. Missing connection with DB from other reasons than: 400 / 401 / 501. Contact the Administrator.</td>
    </tr>
     <tr>
      <td>501</td>
      <td colspan="2">A server error occurred. Contact the Administrator.</td>
    </tr>
  </tbody>
</table>

###**Extrage datele împuternicirii după tip**

<table>
  <thead>
    <tr>
      <th>Semnătura apelului</th>
      <th colspan="2">GET /api/Authorization/check/TypeCode-Valid-One</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Descriere</strong></td>
      <td colspan="2">În baza codului tipului de împuternicire, Idn1 și Idn2 se returnează o înscriere, cu o structură de date care atestă dacă împuternicirea de reprezentare este valabilă sau anulată.</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Parametri de intrare/ieșire</strong></td>
    </tr>
     <tr>
      <td><strong>Denumire</strong></td>
      <td><strong>Tip</strong></td>
      <td><strong>Descriere</strong></td>
    </tr>
     <tr>
      <td><strong>Query</strong></td>
      <td>AuthorizationTypeCodeQuery</td>
      <td>O structură de date care conține detaliile împuternicirii care sunt identificate în baza Cod-ului tipului de împuternicire.</td>
    </tr>
     <tr>
      <td><strong>Response</strong></td>
      <td>AuthorizationValid</td>
      <td>O structură de date aferente împuternicirii de reprezentare care atestă valabilitatea acesteia : True sau False.</td>
    </tr>
     <tr>
      <td colspan="3"><strong>Faults</strong></td>
    </tr>
     <tr>
      <td><strong>Code</strong></td>
      <td><strong>Reason</strong></td>
    </tr>
     <tr>
      <td>200</td>
      <td colspan="2">Success</td>
    </tr>
     <tr>
      <td>404</td>
      <td colspan="2">Not found. Check sent request data</td>
    </tr>
     <tr>
      <td>500</td>
      <td colspan="2">A server error occurred. Missing connection with DB from other reasons than: 400 / 401 / 501. Contact the Administrator.</td>
    </tr>
     <tr>
      <td>501</td>
      <td colspan="2">A server error occurred. Contact the Administrator.</td>
    </tr>
  </tbody>
</table>


###**Extrage datele împuternicirii după INDx**

<table>
  <thead>
    <tr>
      <th>Semnătura apelului</th>
      <th colspan="2">GET /api/Authorization/check/Idn-Details-List</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Descriere</strong></td>
      <td colspan="2">În baza de IDNP sau IDNO returnează lista împuternicirilor de reprezentare.</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Parametri de intrare/ieșire</strong></td>
    </tr>
     <tr>
      <td><strong>Denumire</strong></td>
      <td><strong>Tip</strong></td>
      <td><strong>Descriere</strong></td>
    </tr>
     <tr>
      <td><strong>Query</strong></td>
      <td>AuthorizationListQuery</td>
      <td>Identificarea de baza pe IDNP sau IDNO și opțional cu o structura suplimentară de date aferente împuternicirii de reprezentare.</td>
    </tr>
     <tr>
      <td><strong>Response</strong></td>
      <td>AuthorizationDetails</td>
      <td>O structură de date care conține detaliile împuternicirilor de reprezentare.</td>
    </tr>
     <tr>
      <td colspan="3"><strong>Faults</strong></td>
    </tr>
     <tr>
      <td><strong>Code</strong></td>
      <td><strong>Reason</strong></td>
    </tr>
     <tr>
      <td>200</td>
      <td colspan="2">Success</td>
    </tr>
     <tr>
      <td>404</td>
      <td colspan="2">Not found. Check sent request data</td>
    </tr>
     <tr>
      <td>500</td>
      <td colspan="2">A server error occurred. Missing connection with DB from other reasons than: 400 / 401 / 501. Contact the Administrator.</td>
    </tr>
     <tr>
      <td>501</td>
      <td colspan="2">A server error occurred. Contact the Administrator.</td>
    </tr>
  </tbody>
</table>


###**Descarcă fișierul împuternicirii**

<table>
  <thead>
    <tr>
      <th>Semnătura apelului</th>
      <th colspan="2">GET /api/Authorization/file</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Descriere</strong></td>
      <td colspan="2">În baza codului împuternicirii de reprezentare se returnează o înscriere, cu o structură de date ce conține fișierul de împuternicire.</td>
    </tr>
    <tr>
      <td colspan="3"><strong>Parametri de intrare/ieșire</strong></td>
    </tr>
     <tr>
      <td><strong>Denumire</strong></td>
      <td><strong>Tip</strong></td>
      <td><strong>Descriere</strong></td>
    </tr>
     <tr>
      <td><strong>Query</strong></td>
      <td>authorizationCode</td>
      <td>O structură de date care conține detaliile împuternicirii care sunt identificate în baza codului împuternicirii</td>
    </tr>
     <tr>
      <td><strong>Response</strong></td>
      <td>AuthorizationFile</td>
      <td>O structură de date care conține detaliile împuternicirilor de reprezentare.</td>
    </tr>
     <tr>
      <td colspan="3"><strong>Faults</strong></td>
    </tr>
     <tr>
      <td><strong>Code</strong></td>
      <td><strong>Reason</strong></td>
    </tr>
     <tr>
      <td>200</td>
      <td colspan="2">Success</td>
    </tr>
     <tr>
      <td>404</td>
      <td colspan="2">Not found. Check sent request data</td>
    </tr>
     <tr>
      <td>500</td>
      <td colspan="2">A server error occurred. Missing connection with DB from other reasons than: 400 / 401 / 501. Contact the Administrator.</td>
    </tr>
     <tr>
      <td>501</td>
      <td colspan="2">A server error occurred. Contact the Administrator.</td>
    </tr>
  </tbody>
</table>

##**Structuri de date (Query)**

<table>
  <thead>
    <tr>
      <th><strong>Membru</strong></th>
      <th><strong>Tip</strong></th>
      <th><strong>Obligatoriu/Opțional</strong></th>
      <th><strong>Descriere</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="4"><strong>AuthorizationTypeCodeQuery</strong></td></tr>
    <tr>
      <td>AuthorizationTypeCode</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Se completează codul tipului de împuternicire (Codul atribuit din Fișa-formular aprobată, 10 caractere – „AT-xxxxxxx”).</td>
    </tr>
    <tr>
      <td>AuthorizingIdn</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Se completează IDNP sau INDO al reprezentatului.
      <br>Va conține exact 13 caractere, trebuie să conțină numai numere.</td>
    </tr>
    <tr>
      <td>AuthorizedIdn</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Se completează IDNP sau INDO al reprezentantului.
      <br>Va conține exact 13 caractere, trebuie să conțină numai numere</td>
    </tr>
    <tr><td colspan="4"><strong>AuthorizationListQuery</strong></td></tr>
    <tr>
      <td>IDNx</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Se va returna lista de împuterniciri de reprezentare acordate și primite de către IDNP-ul sau IDNO-ul completare (unde persoana fizică sau juridică are calitatea de reprezentat și reprezentant).
      <br>Va conține exact 13 caractere, trebuie să conțină numai numere.
      <br>Se va compara să fie identic cu AuthorizingContextIdn și AuthorizedIdn.</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>Integer</td>
      <td>Opțional</td>
      <td>Va filtra lista de împuterniciri de reprezentare acordate și primite conform statutului indicat.
      <br>Va conține codul statutului conform enumerațiilor indicate în secțiunea Enumerații.
      <br>Se va compara să fie identic cu Authorization Status.</td>
    </tr>
    <tr>
      <td>AuthorizationTypeCode</td>
      <td>String</td>
      <td>Opțional</td>
      <td>Se completează codul tipului de împuternicire (Codul atribuit din Fișa-formular aprobată, 10 caractere – „AT-xxxxxxx”).</td>
    </tr>
    <tr>
      <td>StartDate</td>
      <td>String</td>
      <td>Opțional</td>
      <td>Se vor afișa împuternicirile de reprezentare care au intrat în vigoare începând cu data indicată.
      <br>Constrângeri: valoare acestui câmp nu poate fi în viitor față de valoarea completată în câmpul EndDate.
      <br>Timpul este setat UTC.
      <br>Exemplu: "2020-09-28T10:35:16.879Z". Se va compara să fie mai mare sau egal ca AuthorizationValidFrom date (AuthorizationValidFrom reprezintă data intrării în vigoare a împuternicirii de reprezentare)</td>
    </tr>
    <tr>
      <td>AuthEndDateorizationTypeCode</td>
      <td>String</td>
      <td>Opțional</td>
      <td>Se vor afișa împuternicirile de reprezentare care au expirat până la data indicată.
      <br>Constrângeri: valoare acestui câmp nu poate fi în trecut față de valoarea completată în câmpul StartDate.
      <br>Timpul este setat UTC.
      <br>Exemplu: "2020-09-28T10:35:16.879Z". Se va compara să fie mai mare sau egal ca Authorization Valid To date (AuthorizationValidTo reprezintă data expirării împuternicirii de reprezentare).</td>
    </tr>
    <tr>
      <td>GrantedByIdn</td>
      <td>String</td>
      <td>Opțional</td>
      <td>Acest parametru va afișa lista de împuterniciri care au fost acordate de către IDNP/IDNO completat.
      <br>Constrângeri: Valoarea acestui câmp trebuie să fie diferită de valoare câmpului GrantedToIdn. Trebuie să conțină 13 caractere, toate caractere trebuie să fie cifre. Se va compara să fie egal cu AuthorizingContextIdn.</td>
    </tr>
    <tr>
      <td>GrantedToIdn</td>
      <td>String</td>
      <td>Opțional</td>
      <td>Se va afișa lista de împuterniciri de reprezentare care au fost primite de la IDNP/IDNO completat.
      <br>Constrângeri: Valoarea acestui câmp trebuie să fie diferită de valoare câmpului GrantedByIdn. Trebuie să conțină 13 caractere, toate caractere trebuie să fie cifre. Se va compara să fie egal AuthorizedIdn.</td>
    </tr>
    <tr>
      <td>ItemsPerPage</td>
      <td>Integer</td>
      <td>Opțional</td>
      <td>parametru specifică pagina care se va afișa. Implicit se afișează înregistrările de pe prima pagină.
      <br>Constrângeri: la completarea unui număr negativ sau zero, sistemul va returna împuternicirile de reprezentare de pe prima pagina, iar la completarea unui număr mai mare decât pagini, se vor afișa zero împuterniciri pe pagină.</td>
    </tr>
  </tbody>
</table>

##**Structuri de date (Response)**

<table>
  <thead>
    <tr>
      <th><strong>Membru</strong></th>
      <th><strong>Tip</strong></th>
      <th><strong>Obligatoriu/Opțional</strong></th>
      <th><strong>Descriere</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="4"><strong>AuthorizationCodeValid</strong></td></tr>
    <tr>
      <td>AuthorizationCode</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Codul unic de identificare al împuternicirii de reprezentare.</td>
    </tr>
    <tr>
      <td>IsValid</td>
      <td>String</td>
      <td>Obligator</td>
      <td>True dacă este valabilă
      <br>False dacă nu este valabilă</td>
    </tr>
    <tr><td colspan="4"><strong>AuthorizationDetails</strong></td></tr>
    <tr>
      <td>AuthorizationCode</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Codul unic de identificare al împuternicirii de reprezentare.</td>
    </tr>
    <tr>
      <td>AuthorizationTypeCode</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Codul tipului împuternicirii de reprezentare (conform Formularului aprobat).</td>
    </tr>
    <tr>
      <td>AuthorizingPartyType</td>
      <td>Integer</td>
      <td>Obligator</td>
      <td>ID-ul tipului reprezentatului, a se vedea enumerațiile conform secțiunii Enumerații</td>
    </tr>
    <tr>
      <td>AuthorizingIdn</td>
      <td>String</td>
      <td>Obligator</td>
      <td>IDNP sau INDO al reprezentatului.</td>
    </tr>
    <tr>
      <td>AuthorizedPartyType</td>
      <td>Integer</td>
      <td>Obligator</td>
      <td>ID-ul tipului reprezentantului, a se vedea enumerațiile conform secțiunii Enumerații</td>
    </tr>
    <tr>
      <td>AuthorizedIdn</td>
      <td>String</td>
      <td>Obligator</td>
      <td>IDNP sau INDO al reprezentantului.</td>
    </tr>
    <tr>
      <td>From</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Dacă isValid=True -> Data de când este valabilă împuternicire de reprezentare.
      <br>Dacă isValid=False -> Data de când este suspendată sau nevalabilă împuternicire de reprezentare.
      <br>Timpul este setat UTC.</td>
    </tr>
    <tr>
      <td>To</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Dacă isValid=True -> Data până când este valabilă împuternicire de reprezentare
      <br>Dacă isValid=False -> "null".
      <br>Timpul este setat UTC.</td>
    </tr>
    <tr>
      <td>IsValid</td>
      <td>String</td>
      <td>Obligator</td>
      <td>True dacă este valabilă
      <br>False dacă nu este valabilă</td>
    </tr>
    <tr>
      <td>AuthorizingPartyName</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Prenumele și numele reprezentatului</td>
    </tr>
    <tr>
      <td>AuthorizedPartyName</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Prenumele și numele reprezentantului</td>
    </tr>
    <tr>
      <td>AuthorizationTypeName</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Denumirea tipului de împuternicire</td>
    </tr>
    <tr>
      <td>ServiceProviderIdno</td>
      <td>String</td>
      <td>Obligator</td>
      <td>INDO-ul prestatorului de servicii</td>
    </tr>
    <tr>
      <td>ServiceProviderName</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Denumirea prestatorului de servicii</td>
    </tr>
    <tr><td colspan="4"><strong>AuthorizationFile</strong></td></tr>
    <tr>
      <td>content</td>
      <td>byte[]</td>
      <td>Obligator</td>
      <td>Conținutul fișierului ce conține date despre împuternicirea căutată</td>
    </tr>
    <tr>
      <td>content-type</td>
      <td>String</td>
      <td>Obligator</td>
      <td>Tipul fișierului împuternicirii. Implicit: "application/pdf"</td>
    </tr>
  </tbody>
</table>

##**Enumerații**

<table>
  <thead>
    <tr>
      <th><strong>Atribute</strong></th>
      <th colspan="2"><strong>Descriere</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="3"><strong>AuthorizationGrantedType</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>IR care este Acordata de IDNx</td>
      <td></td>
    </tr>
    <tr>
      <td>2</td>
      <td>IR care este Primită de IDNx</td>
      <td></td>
    </tr>
    <tr>
      <td>3</td>
      <td>IR care este Cosemnată de IDNx</td>
      <td></td>
    </tr>
    <tr>
      <td colspan="3"><strong>AuthorizationStaus</strong></td>
    </tr>
    <tr>
      <td>Draft</td>
      <td>IR este creat, dar nu este valabil</td>
      <td>None</td>
    </tr>
    <tr>
      <td>PendingAcceptance</td>
      <td>IR este acordat, dar necesită acceptanța reprezentantului pentru a deveni valabil</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Pending</td>
      <td>IR este acordat, dar va fi valabil la o dată în viitor</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Valid</td>
      <td>IR este valabil și poate fi utilizat în scop de reprezentare</td>
      <td>isValid=True</td>
    </tr>
    <tr>
      <td>Canceled</td>
      <td>IR este expirat, revocat sau s-a renunțat</td>
      <td>isValid=False</td>
    </tr>
    <tr>
      <td>Suspended</td>
      <td>IR este suspendat</td>
      <td>isValid=False</td>
    </tr>
    <tr>
      <td colspan="2"><strong>AuthorizingPartyType</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td colspan="2">Persoană fizică</td>
    </tr>
    <tr>
      <td>2</td>
      <td colspan="2">Persoană juridică</td>
    </tr>
    <tr>
      <td colspan="2"><strong>AuthorizedPartyType</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td colspan="2">Persoană fizică</td>
    </tr>
    <tr>
      <td>2</td>
      <td colspan="2">Persoană juridică</td>
    </tr>
<tr>
      <td colspan="3"><strong>Status</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Împuternicirea de reprezentare care a fost salvată în schiță (nu este acordată)</td>
      <td>Draft</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Împuternicirea de reprezentare care a fost acordată, dar necesită acceptarea reprezentantului pentru a fi valabilă</td>
      <td>PendingAcceptance</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Împuternicirea de reprezentare care a fost acordată, dar data de intrare în vigoare este în viitor</td>
      <td>PendingValidity</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Împuternicirea de reprezentare care este valabilă.</td>
      <td>Valid</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Împuternicirea de reprezentare care este suspendată.</td>
      <td>Suspended</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Împuternicirea de reprezentare care nu este valabilă ca urmare a expirării, renunțării, revocării</td>
      <td>Canceled</td>
    </tr>
  </tbody>
</table>

##**Exemple de apelări a metodelor API**

###**GET /api/Authorization/check/Code-True-One**

=== "Request"

    ```curl
    curl -X GET "https://mpower.staging.egov.md:8443/clients-api/api/Authorization/check/Code-True-One?AuthorizationCode=0200905142878268" -H "accept: text/plain"
    ```

=== "Response"

    ```json
    {
      "data": true,
      "success": true,
      "messages": []
    }
    ```

###**GET /api/Authorization/check/Code-Details-One**

=== "Request"

    ```curl
    curl -X GET "https://mpower.staging.egov.md:8443/clients-api/api/Authorization/check/Code-Details-One?AuthorizationCode=0200935852951597" -H "accept: text/plain"
    ```

=== "Response"

    ```json
    {
      "data": {
        "authorizationCode": "0200935852951597",
        "authorizationTypeCode": "AT-2100025",
        "authorizingPartyType": 2,
        "authorizingIdn": "1009600026622",
        "authorizedPartyType": 1,
        "authorizedIdn": "2001003328546",
        "fromDate": "2020-09-22T14:16:06.0932925",
        "toDate": "2021-03-22T21:59:59.999",
        "isValid": true,
        "authorizingPartyName": "Esempla SRL",
        "authorizedPartyName": "L CHIRIŢA",
        "authorizationTypeName": "Ridicare original document",
        "serviceProviderIdno": "1009600026622",
        "serviceProviderName": "Companie SRL"
      },
      "success": true,
      "messages": []
    }
    ```

###**GET /api/Authorization/check/TypeCode-Valid-One**

=== "Request"

    ```curl
    curl -X GET "https://mpower.staging.egov.md:8443/clients-api/api/Authorization/check/TypeCode-Valid-One?AuthorizationTypeCode=AT-2100025&AuthorizingIdn=1009600026622&AuthorizedIdn=2001003328546" -H "accept: text/plain"
    ```

=== "Response"

    ```json
    {
      "data": {
        "authorizationCode": "0200935852951597",
        "isValid": true
      },
      "success": true,
      "messages": []
    }
    ```

###**GET /api/Authorization/check/Idn-Details-List**

!NOT PROVIDED INTO PREVIOUS DOCUMENTATION 

###**GET /api/Authorization/file**

=== "Request"

    ```curl
    curl -X GET "https://mpower.dev.egov.md:8443/clients-api/api/Authorization/file ? ?AuthorizationCode=0200905142878268" " -H "accept: text/plain"
    ```

=== "Response"

    ```json
    {
      "data": {
        "content": "JVBERi0xLjcKJeLjz9MKNyAwIG9iago8PC9GaWx0ZXI…",
        "content-type": "application/pdf"
      },
      "success": true,
      "messages": []
    }
    ```

