#Referințe API

##**Reguli de tratare a erorilor**

Pentru erorile rezultate din apelurile interfeței SOAP, MSign returnează fault-uri SOAP cu coduri de eroare și motive ale fault-ului, descrise în limba engleză simplă. Dacă nu este returnat un fault SOAP de către MSign, consumatorul serviciului ar trebui să considere că rezultatul operației returnate, conform contractului de serviciu MSign, este valid și poate fi utilizat direct, fără verificări suplimentare ale erorilor.

Reține că un SignResponse conține SignStatus, care poate avea valorile Pending, Failure sau Expired, ceea ce înseamnă că nu sunt returnate rezultatele semnării.

<table>
  <thead>
    <tr>
      <th>Fault Code</th>
      <th>Descriere</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AuthenticationFailed</td>
      <td>Procesul de autentificare al consumatorului de servicii a eșuat. Vezi Authentication</td>
    </tr>
    <tr>
      <td>AuthorizationFailed</td>
      <td>Procesul de autorizare al consumatorului de servicii a eșuat. Vezi Authorization</td>
    </tr>
    <tr>
      <td>InvalidParameter</td>
      <td>Unul dintre parametrii de intrare este invalid. Te rugăm să consulți mesajul Fault Reason returnat și descrierea operației apelate.</td>
    </tr>
    <tr>
      <td>RequestNotFound</td>
      <td>ID-ul de cerere furnizat la apelul GetSignResponse nu a fost găsit de MSign. Este posibil să fie incorect sau expirat (de exemplu, eliminat din baza de date online).</td>
    </tr>
  </tbody>
</table>

Consumatorii care folosesc limbaje de programare ce suportă blocuri try…catch, trebuie să gestioneze corect erorile apărute la invocarea serviciului prin prinderea excepțiilor de tip SOAP Fault specifice framework-ului utilizat.

##**Operațiuni ale serviciului**

###**PostSignRequest**

<table>
  <tbody>
    <tr>
      <td><strong>Semnătura apelului</strong></td>
      <td>PostSignRequest: PostSignRequest(request: SignRequest): string</td>
    </tr>
    <tr>
      <td><strong>Descriere</strong></td>
      <td>Trimite o cerere de semnătură pentru a fi semnată ulterior.</td>
    </tr>
    <tr>
      <td><strong>Structura de răspuns</strong></td>
      <td>Un șir de caractere care reprezintă ID-ul cererii, ce poate fi folosit ulterior cu GetSignResponse.</td>
    </tr>
  </tbody>
</table>

**Parametri de intrare**

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
      <td>request</td>
      <td>SignRequest</td>
      <td>O structură ce reprezintă cererea de semnare.</td>
    </tr>
  </tbody>
</table>

**Eșuări**

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AuthenticationFailed</td>
      <td>Certificat de autentificare invalid furnizat, consumator de servicii necunoscut: {certificate serial number}</td>
    </tr>
    <tr>
      <td>InvalidParameter</td>
      <td>Unul dintre parametrii de intrare este invalid. Te rugăm să consulți mesajul Fault Reason returnat și descrierea operației apelate.</td>
    </tr>
</tbody>
</table>

###**GetSignResponse**

<table>
  <tbody>
    <tr>
      <td><strong>Semnătura apelului</strong></td>
      <td>GetSignResponse(requestID: string, language: string): SignResponse</td>
    </tr>
    <tr>
        <td><strong>Descriere</strong></td>
        <td>Obține starea și rezultatul cererii de semnare corespunzătoare.</td>
    </tr>
    <tr>
        <td><strong>Structura de răspuns</strong></td>
        <td>O structură care conține starea și rezultatele semnăturii.</td>
    </tr>

  </tbody>
</table>

**Parametri de intrare**

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
      <td>requestID</td>
      <td>string</td>
      <td>ID-ul cererii SignRequest transmisă anterior folosind operația PostSignRequest.</td>
    </tr>
    <tr>
      <td>language</td>
      <td>string</td>
      <td>Limba utilizată pentru localizarea răspunsului. Valori permise: „ro”, „ru”, „en”. Pentru compatibilitate cu versiunile anterioare, acest parametru este opțional, valoarea implicită fiind „ro”.</td>
    </tr>
  </tbody>
</table>

**Eșuări**

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AuthenticationFailed</td>
      <td>Certificat de autentificare invalid furnizat, sistem necunoscut sau neînregistrat: {certificate serial number}</td>
    </tr>
    <tr>
      <td>AuthorizationFailed</td>
      <td>Această cerere de semnare nu a fost inițiată de acest sistem</td>
    </tr>
    <tr>
      <td>InvalidParameter</td>
      <td>Unul dintre parametrii de intrare este invalid. Te rugăm să consulți mesajul Fault Reason returnat și descrierea operației apelate</td>
    </tr>
    <tr>
      <td>RequestNotFound</td>
      <td>Nu a putut fi găsită o astfel de cerere</td>
    </tr>
  </tbody>
</table>

###**VerifySignatures**

<table>
  <tbody>
    <tr>
      <td><strong>Semnatura apelului</strong></td>
      <td>VerifySignatures(request: VerificationRequest): VerificationResponse</td>
    </tr>
    <tr>
      <td><strong>Descriere</strong></td>
      <td>Solicită verificarea unei semnături. Deoarece procesul de verificare poate dura mai mult decât se anticipează, se recomandă invocarea acestei operații în mod asincron, astfel încât aplicația care o apelează să nu pară blocată.</td>
    </tr>
    <tr>
      <td><strong>Structura de răspuns</strong></td>
      <td>O structură care conține rezultatul și informațiile despre verificarea semnăturii.</td>
    </tr>
  </tbody>
</table>

**Parametri de intrare**

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
      <td>request</td>
      <td>VerificationRequest</td>
      <td>O structură care reprezintă cererea de verificare.</td>
    </tr>
  </tbody>
</table>

**Eșuări**

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Reason</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>AuthenticationFailed</td>
      <td>Certificat de autentificare invalid furnizat sau consumator de servicii necunoscut: {certificate serial number}</td>
    </tr>
    <tr>
      <td>InvalidParameter</td>
      <td>Unul dintre parametrii de intrare este invalid. Te rugăm să consulți mesajul Fault Reason returnat și descrierea operației apelate.</td>
    </tr>
    <tr>
      <td>RequestNotFound</td>
      <td>Nu a putut fi găsită o astfel de cerere</td>
    </tr>
  </tbody>
</table>

##**Structuri de date**

<span class="red-bold-text">Important.</span> Ordinea în care membrii sunt descriși mai jos este doar în scop explicativ. Ordinea elementelor în structurile XML actuale, așa cum este definită în WSDL, este alfabetică. Pentru o implementare corectă, se recomandă utilizarea unui instrument de conversie automată din WSDL către limbajul sau mediul tău de programare.

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
    <tr><td colspan="4"><strong>SignRequest</strong></td></tr>
    <tr>
      <td>ContentDescription</td>
      <td>string (512)</td>
      <td>Opțional, iplicit: are valoare exactă ca în ShortContentDescription</td>
      <td>Descrierea conținutului care urmează a fi semnat. Afișată pe paginile web MSign.</td>
    </tr>
    <tr>
      <td>ShortContentDescription</td>
      <td>string (90)</td>
      <td>Obligatoriu</td>
      <td>Descrierea scurtă a conținutului ce urmează a fi semnat. Afișată pe telefonul mobil dacă se folosește semnătura mobilă.</td>
    </tr>
    <tr>
      <td>SignatureReason</td>
      <td>string (255)</td>
      <td>Opțional</td>
      <td>Motivul semnăturii, de ex. Rezoluție, Aprobat, Revizuit etc. Aplicabil în prezent doar pentru PDF.</td>
    </tr>
    <tr>
      <td>ContentType</td>
      <td>ContentType enumeration</td>
      <td>Obligatoriu</td>
      <td>Tipul conținutului care urmează a fi semnat.</td>
    </tr>
    <tr>
      <td>Contents</td>
      <td>Array de elemente SignContent</td>
      <td>Obligatoriu, cel puțin un element</td>
      <td>Setul efectiv de conținuturi care urmează a fi semnate.</td>
    </tr>
    <tr>
      <td>ExpectedSigner</td>
      <td>ExpectedSigner</td>
      <td>Optional</td>
      <td>Dacă este furnizat, MSign va verifica dacă semnatarul efectiv corespunde informațiilor furnizate.</td>
    </tr>
    <tr><td colspan="4"><strong>SignResponse</strong></td></tr>
    <tr>
      <td>Status</td>
      <td>SignStatus enumeration</td>
      <td>Obligatoriu</td>
      <td>Starea cererii de semnătură</td>
    </tr>
    <tr>
      <td>Message</td>
      <td>string (100)</td>
      <td>Opțional, este prezent doar în cazul cererilor cu statut Failure sau Expired</td>
      <td>Mesaj de eșec pentru cererea de semnătură, localizat conform parametrului de limbă.</td>
    </tr>
    <tr>
      <td>Results</td>
      <td>Array de elemente SignResult</td>
      <td>Opțional, prezent pentru cererile cu statut Pending</td>
      <td>Rezultatele semnăturilor pentru cererea de semnătură solicitată.</td>
    </tr>
    <tr><td colspan="4"><strong>VerificationRequest</strong></td></tr>
    <tr>
      <td>SignedContentType</td>
      <td>ContentType enumeration</td>
      <td>Obligatoriu</td>
      <td>Tipul conținutului care a fost semnat anterior.</td>
    </tr>
    <tr>
      <td>Language</td>
      <td>string (2)</td>
      <td>Opțional, implicit: ro</td>
      <td>Limba utilizată pentru localizarea răspunsului. Valori permise: „ro”, „ru”, „en”.</td>
    </tr>
    <tr>
      <td>Contents</td>
      <td>Array de elememente VerificationContent</td>
      <td>Obligatoriu, cel puțin un element</td>
      <td>Setul efectiv de semnături care trebuie verificate.</td>
    </tr>
    <tr><td colspan="4"><strong>VerificationResponse</strong></td></tr>
    <tr>
      <td>Results</td>
      <td>Array de elemente VerificationResult</td>
      <td>Obligatoriu</td>
      <td>Rezultatele verificării pentru cererea de verificare.</td>
    </tr>
    <tr><td colspan="4"><strong>SignRequest</strong></td></tr>
    <tr>
      <td>CorrelationID</td>
      <td>string (36)</td>
      <td>Opțional</td>
      <td>ID-ul de corelare pentru acest conținut. Trebuie să fie unic în cadrul unei cereri de semnătură.</td>
    </tr>
    <tr>
      <td>MultipleSignatures</td>
      <td>Bool</td>
      <td>Opțional, implicit: false</td>
      <td>Specifică dacă conținutul poate avea mai multe semnături (ex. poate fi co-semnat). Momentan aplicabil doar pentru PDF.</td>
    </tr>
    <tr>
      <td>Name</td>
      <td>string (256)</td>
      <td>Opțional</td>
      <td>Numele fișierului PDF; pentru Hash această proprietate este redundantă.</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Array de biți</td>
      <td>Obligatoriu</td>
      <td>Conținutul efectiv care urmează a fi semnat. În prezent, poate fi un hash SHA1 de 20 de octeți sau un fișier PDF.</td>
    </tr>
    <tr><td colspan="4"><strong>ExpectedSigner</strong></td></tr>
    <tr>
      <td>ID</td>
      <td>String</td>
      <td>Obligatoriu</td>
      <td>Numărul de identificare personală al semnatarului așteptat.
      <br>Notă: dacă nu este furnizat, utilizatorul va fi întrebat la semnarea PDF-ului cu semnătură mobilă.</td>
    </tr>
    <tr>
      <td>DelegatorType</td>
      <td>DelegatorType enumeration</td>
      <td>Opțional, implicit: None</td>
      <td>Tipul delegatarului.</td>
    </tr>
    <tr>
      <td>DelegatorID</td>
      <td>String</td>
      <td>Obligatoriu în cazul în care DelegatorType este diferit decât None</td>
      <td>Identificatorul persoanei sau organizației pe care semnatarul așteptat o reprezintă (prin delegare).</td>
    </tr>
    <tr>
      <td>DelegatedRoleID</td>
      <td>Int</td>
      <td>Opțional, implicit: 0</td>
      <td>Rolul semnatarului așteptat în raport cu delegatarul.</td>
    </tr>
    <tr><td colspan="4"><strong>SignResult</strong></td></tr>
    <tr>
      <td>CorrelationID</td>
      <td>string (36)</td>
      <td>Opțional, prezent dacă a fost trimis în  din SignRequest</td>
      <td>ID-ul de corelare pentru conținutul semnat, așa cum a fost furnizat inițial în SignContent.</td>
    </tr>
    <tr>
      <td>Certificate</td>
      <td>Array de biți</td>
      <td>Opțional, present dacă semnătura a avut loc cu succes</td>
      <td>Certificatul semnatarului în format X509 v3.</td>
    </tr>
    <tr>
      <td>Signature</td>
      <td>Array de biți</td>
      <td>Opțional, present dacă semnătura a avut loc cu succes</td>
      <td>Pentru conținut de tip hash: semnătura digitală efectivă în format XAdES-T; pentru PDF: documentul PDF semnat.</td>
    </tr>
    <tr><td colspan="4"><strong>VerificationContent</strong></td></tr>
    <tr>
      <td>CorrelationID</td>
      <td>string (36)</td>
      <td>Opțional</td>
      <td>ID-ul de corelare pentru acest conținut. Trebuie să fie unic în cadrul unei cereri de verificare.</td>
    </tr>
    <tr>
      <td>Content</td>
      <td>Array de biți</td>
      <td>Obligatoriu, doar pentru conținutul Hash.</td>
      <td>Hash-ul care a fost semnat inițial. Acest parametru este necesar doar pentru verificarea semnăturilor hash. Valoarea sa este necesară pentru o verificare completă.</td>
    </tr>
    <tr>
      <td>Signature</td>
      <td>Array de biți</td>
      <td>Obligatoriu</td>
      <td>Semnătura efectivă care trebuie verificată. Trebuie să fie un XAdES sau un PDF semnat.</td>
    </tr>
    <tr><td colspan="4"><strong>VerificationResult</strong></td></tr>
    <tr>
      <td>CorrelationID</td>
      <td>string (36)</td>
      <td>Opțional, este prezent dacă a fost trimis în VerificationContent</td>
      <td>ID-ul de corelare pentru conținutul verificat, așa cum a fost furnizat inițial în VerificationContent.</td>
    </tr>
    <tr>
      <td>SignaturesValid</td>
      <td>Bool</td>
      <td>Obligatoriu</td>
      <td>Returnează true dacă toate semnăturile aplicate conținutului sunt valide.</td>
    </tr>
    <tr>
      <td>Message</td>
      <td>string (100)</td>
      <td>Obligatoriu</td>
      <td>Mesajul rezultat al verificării, localizat conform VerificationRequest.Language.</td>
    </tr>
    <tr>
      <td>Certificates</td>
      <td>Array de elemente VerificationCertificate</td>
      <td>Opțional, present dacă a fost identificat cel puțin un certificat în semnătură</td>
      <td>Lista certificatelor (unul pentru fiecare hash semnat în cazul XAdES) ale semnatarilor. Returnate în scop de afișare.</td>
    </tr>
    <tr><td colspan="4"><strong>VerificationCertificate</strong></td></tr>
    <tr>
      <td>SignatureValid</td>
      <td>Bool</td>
      <td>Obligatoriu</td>
      <td>Returnează true dacă semnătura corespunzătoare acestui certificat este validă.</td>
    </tr>
    <tr>
      <td>Subject</td>
      <td>string (250)</td>
      <td>Obligatoriu</td>
      <td>Detalii despre subiect din certificat. Returnate pentru afișare.</td>
    </tr>
    <tr>
      <td>Certificate</td>
      <td>Array de biți</td>
      <td>Obligatoriu</td>
      <td>Certificatul semnatarului în format X509 v3.</td>
    </tr>
    <tr>
      <td>SignedAt</td>
      <td>Datetime</td>
      <td>Opțional</td>
      <td>Data și ora semnăturii. Returnată doar dacă a fost aplicat un timestamp valid.</td>
    </tr>
  </tbody>
</table>


##**Enumerations**

<table>
  <thead>
    <tr>
      <th><strong>Membru</strong></th>
      <th><strong>Descriere</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2"><strong>ContentType</strong></td>
    </tr>
    <tr>
      <td>Hash</td>
      <td>Conținutul care urmează a fi semnat este un hash SHA1.</td>
    </tr>
    <tr>
      <td>Pdf</td>
      <td>Conținutul care urmează a fi semnat este un fișier PDF.</td>
    </tr>
    <tr>
      <td colspan="2"><strong>DelegatorType</strong></td>
    </tr>
    <tr>
      <td>None</td>
      <td>Nu există un delegatar.</td>
    </tr>
    <tr>
      <td>Person</td>
      <td>Delegatarul este o persoană.</td>
    </tr>
    <tr>
      <td>Organization</td>
      <td>Delegatarul este o organizație.</td>
    </tr>
    <tr>
      <td colspan="2"><strong>SignStatus</strong></td>
    </tr>
    <tr>
      <td>Pending</td>
      <td>Semnarea este în așteptare.</td>
    </tr>
    <tr>
      <td>Success</td>
      <td>Semnarea s-a încheiat și semnătura este validă.</td>
    </tr>
    <tr>
      <td>Failure</td>
      <td>Semnarea a eșuat. Cererea de semnătură nu mai este valabilă.</td>
    </tr>
    <tr>
      <td>Expired</td>
      <td>Cererea de semnătură a expirat. Cererea de semnătură nu mai este valabilă.</td>
    </tr>
  </tbody>
</table>

##**Integrarea Web**

###**Apelul de semnare**

<table>
  <tbody>
    <tr>
      <td><strong>Metoda de apelare<strong></td>
      <td>POST (recomandat) sau GET</td>
    </tr>
    <tr>
      <td><strong>URL<strong></td>
      <td><a htef="https://msign.gov.md/{requestID}">https://msign.gov.md/{requestID}</a></td>
    </tr>
    <tr>
      <td><strong>Descriere<strong></td>
      <td>Direcționează utilizatorul pentru a efectua semnarea propriu-zisă. Observă că requestID-ul este încorporat în URL-ul metodei.</td>
    </tr>
  </tbody>
</table>

**Form POST or URL parameters**

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
      <td>ReturnUrl</td>
      <td>string</td>
      <td>Obligatoriu</td>
      <td>URL-ul care va primi rezultatul semnării tranzacției</td>
    </tr>
    <tr>
      <td>Instrument</td>
      <td>string</td>
      <td>Opțional, nu este recomandat</td>
      <td>Instrumentul de semnare care va fi utilizat, adică se omite pagina de selecție a instrumentului. Valori permise: „mobile”, „moldsign”, „nationalid”, „securesign”, „tax”.
      <br> Notă: pentru ca instrumentul „mobile” să funcționeze fără selecție, trebuie să furnizezi MSISDN și ExpectedSigner.ID al semnatarului așteptat.</td>
    </tr>
    <tr>
      <td>MSISDN</td>
      <td>string ce conține cifre</td>
      <td>Opțional</td>
      <td>Numărul de telefon mobil al semnatarului așteptat, dacă este cunoscut</td>
    </tr>
    <tr>
      <td>RelayState</td>
      <td>string</td>
      <td>Opțional</td>
      <td>Șir opțional care va fi returnat înapoi nemodificat după semnare</td>
    </tr>
    <tr>
      <td>lang</td>
      <td>string</td>
      <td>Opțional</td>
      <td>Limba utilizată de interfața MSign. Valori permise: „ro”, „ru”, „en”</td>
    </tr>
  </tbody>
</table>

###**Apelul de callback pentru semnare**

<table>
  <tbody>
    <tr>
      <td><strong>Methodă<strong></td>
      <td>POST</td>
    </tr>
    <tr>
      <td><strong>URL<strong></td>
      <td>Adresa ReturnUrl furnizată în cererea de semnare.</td>
    </tr>
    <tr>
      <td><strong>Descriere<strong></td>
      <td>Redirecționează utilizatorul către sistemul informațional care a solicitat semnătura, informând în același timp sistemul că procesarea SignRequest s-a încheiat. Acest URL este accesat doar după ce rezultatul semnării este cunoscut (adică SignStatus este fie Failure, fie Success).</td>
    </tr>
  </tbody>
</table>

**Parametrii din Form**

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
      <td>RequestID</td>
      <td>string</td>
      <td>Obligatoriu</td>
      <td>ID-ul cererii SignRequest finalizate</td>
    </tr>
    <tr>
      <td>RelayState</td>
      <td>string</td>
      <td>Opțional, nu este recomndat</td>
      <td>Valoarea RelayState nemodificată, așa cum a fost trimisă în cerere</td>
    </tr>
  </tbody>
</table>

##**Exemple de mesaje SOAP**

!!! note "Implementare manuală"

    Vom prezenta aici exemple de mesaje SOAP schimbate. Acestea pot fi utile pentru cei care integrează cu MSign, dar nu oferă suport complet pentru generarea de proxy-uri de servicii pe bază de WSDL.


###**Metoda: PostSignRequest**

=== "request.xml"

    ```xml
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Header>
        <Action s:mustUnderstand="1" xmlns="http://schemas.microsoft.com/ws/2005/05/addressing/none">https://msign.gov.md/IMSign/PostSignRequest</Action>
      </s:Header>
      <s:Body>
        <PostSignRequest xmlns="https://msign.gov.md">
          <request xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <ContentDescription>Sample long description</ContentDescription>
            <ContentType>Hash</ContentType>
            <Contents>
              <SignContent>
                <Content>ZhKVycv51rL2QoQUUEqN7tMCBkE=</Content>
                <CorrelationID>3408cc344e474a529f3425176a75d08e</CorrelationID>
              </SignContent>
            </Contents>
            <ShortContentDescription>MSign Sample.</ShortContentDescription>
          </request>
        </PostSignRequest>
      </s:Body>
    </s:Envelope>
    ```

=== "response.xml"

    ```xml
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Body>
        <PostSignRequestResponse xmlns="https://msign.gov.md">
          <PostSignRequestResult>eec7709d372b41109e2ea3e200e99727</PostSignRequestResult>
        </PostSignRequestResponse>
      </s:Body>
    </s:Envelope>
    ```

###**Metoda: GetSignResponse**

=== "request.xml"

    ```xml
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Header>
        <Action s:mustUnderstand="1" xmlns="http://schemas.microsoft.com/ws/2005/05/addressing/none">https://msign.gov.md/IMSign/GetSignResponse</Action>
      </s:Header>
      <s:Body>
        <GetSignResponse xmlns="https://msign.gov.md">
          <requestID>eec7709d372b41109e2ea3e200e99727</requestID>
          <language>en</language> 
        </GetSignResponse> 
      </s:Body> 
    </s:Envelope>

    ```

=== "response.xml"

    ```xml
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Body>
        <GetSignResponseResponse xmlns="https://msign.gov.md">
          <GetSignResponseResult xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <Results>
              <SignResult>
                <Certificate>MIIG… </Certificate>
                <CorrelationID>3408cc344e474a529f3425176a75d08e</CorrelationID>
                <Signature>PD94… </Signature>
              </SignResult>
            </Results>
            <Status>Success</Status>
          </GetSignResponseResult>
        </GetSignResponseResponse>
      </s:Body>
    </s:Envelope>
    ```

###**Metoda: VerifySignatures**

=== "request.xml"

    ```xml
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Header>
        <Action s:mustUnderstand="1" xmlns="http://schemas.microsoft.com/ws/2005/05/addressing/none">https://msign.gov.md/IMSign/VerifySignatures</Action>
      </s:Header>
      <s:Body>
        <VerifySignatures xmlns="https://msign.gov.md">
          <request xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <Contents>
              <VerificationContent>
                <Content>ZhKVycv51rL2QoQUUEqN7tMCBkE=</Content>
                <CorrelationID>bd73ed7eabc44ab290b18181a9e7fd2b</CorrelationID>
                <Signature>PD94… </Signature>
              </VerificationContent>
            </Contents>
            <Language>en</Language>
            <SignedContentType>Hash</SignedContentType>
          </request>
        </VerifySignatures>
      </s:Body>
    </s:Envelope>
    ```

=== "response.xml"

    ```xml
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
      <s:Body>
        <VerifySignaturesResponse xmlns="https://msign.gov.md">
          <VerifySignaturesResult xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
            <Results>
              <VerificationResult>
                <Certificates>
                  <VerificationCertificate>
                    <Certificate>MIIG… </Certificate>
                    <SignatureValid>true</SignatureValid>
                    <Subject>O=Centrul de Guvernare Electronică (e-government) 1010600034203, OU=IT, C=MD, PostalCode=MD-2033, T=Functia, STREET=Piața Marii Adunări Naționale 1, Phone=022250234, S=Republica Moldova, L=Chișinău, SERIALNUMBER=IDNP, CN=Nume Prenume</Subject>
                  </VerificationCertificate>
                </Certificates>
                <CorrelationID>bd73ed7eabc44ab290b18181a9e7fd2b</CorrelationID>
                <Message>The signature is valid</Message>
                <SignaturesValid>true</SignaturesValid>
              </VerificationResult>
            </Results>
          </VerifySignaturesResult>
        </VerifySignaturesResponse>
      </s:Body>
    </s:Envelope>
    ```
