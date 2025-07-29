#Implementarea integrărilor

##**Pentru început**

###**Înregistrarea sistemului și accesare serviciului**

MPower autentifică sistemele terțe prin numărul de serie al certificatului. Sistemele terțe urmează să fie înregistrarea în MPass înainte de a chema metodele API.

Metodele API ale MPower sunt accesibile numai adreselor IP înregistrate.

Pentru a solicita accesul, prin email: [suport.mpower@egov.md](mailto:suport.mpower@egov.md) se vor expedia informații cu privire la: adresa IP sau VPN-ul asociat unei adrese IP private și numărul de serie al certificatului.

###**Obținerea datelor de acces**

Pentru a realiza integrarea cu serviciul este necesar să dețineți certificate generate de către Serviciul Tehnologia Informației și Securitate Cibernetică. Pentru detalii privind obținerea/prelungirea certificatului cheii publice vă rugăm să accesați [https://stisc.gov.md/ro/semnatura-electronica](https://stisc.gov.md/ro/semnatura-electronica).

###**Mediile serviciului**

Integrarea are loc prin Rest API. Metodele API pot fi accesate prin mediul de test și mediul de producție:

<table>
  <thead>
    <tr>
      <th>Mediul</th>
      <th>URL-ul serviciului MPower</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Test</td>
      <td><a href="https://mpower.staging.egov.md:8443/clients-api/swagger/index.html">https://mpower.staging.egov.md:8443/clients-api/swagger/index.html</a></td>
    </tr>
    <tr>
      <td>Producție</td>
      <td><a href="https://mpower.gov.md:8443/clients-api/swagger/index.html">https://mpower.gov.md:8443/clients-api/swagger/index.html</a></td>
    </tr>
  </tbody>
</table>

!!!note "Important"

    Este obligator de a realiza integrările și testările aferente pe mediul de test.

##**Integration testing**

!!!note "Test cases"

    Here are some basic test cases that could be added to the test suite that integrates with MSign.


###**Case #1**

<table>
  <tbody>
    <tr>
      <td><strong>Test Case ID</strong></td>
      <td colspan="3">TC_FUNCT_01</td>
    </tr>
    <tr>
      <td><strong>Description</strong></td>
      <td colspan="3">Verify the successful integration of the e-Service and MSign</td>
    </tr>
    <tr>
      <td><strong>Applicable for</strong></td>
      <td colspan="3">List of browsers as specified in requirements</td>
    </tr>
    <tr>
      <td><strong>Requirements</strong></td>
      <td colspan="3">REQ_FUNCT_XX</td>
    </tr>
    <tr>
      <td><strong>Initial Conditions</strong></td>
      <td colspan="3">Open the e-Service under test in a browser window. Go through the e-Service web pages, enter the data or upload the document to be signed and navigate to the page with Sign button, in order to perform the signing.</td>
    </tr>
    <tr>
      <td><strong>Step</strong></td>
      <td><strong>Task</strong></td>
      <td><strong>Expected Result</strong></td>
      <td><strong>Actual Result</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Click the Sign button.</td>
      <td>The MSign sign page is displayed to the user.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
    <tr>
      <td>2</td>
      <td>Select the first signing instrument and enter the data related to the selected instrument. Submit data.</td>
      <td>The browser re-displays the e-Services page, requested signatures being successfully provided.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
    <tr>
      <td>3</td>
      <td>Repeat previous step (Step2) for each available signing instrument.</td>
      <td>The browser re-displays the e-Services page, requested signatures being successfully provided.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
  </tbody>
</table>

###**Case #2**

<table>
  <tbody>
    <tr>
      <td><strong>Test Case ID</strong></td>
      <td colspan="3">TC_FUNCT_02</td>
    </tr>
    <tr>
      <td><strong>Description</strong></td>
      <td colspan="3">Verify failed signing by cancelling the signature process</td>
    </tr>
    <tr>
      <td><strong>Applicable for</strong></td>
      <td colspan="3">List of browsers as specified in requirements</td>
    </tr>
    <tr>
      <td><strong>Requirements</strong></td>
      <td colspan="3">REQ_FUNCT_XX</td>
    </tr>
    <tr>
      <td><strong>Initial Conditions</strong></td>
      <td colspan="3">Open the e-Service under test in a browser window. Go through the e-Service web pages, enter the data or upload the document to be signed and navigate to the page with Sign button, in order to perform the signing.</td>
    </tr>
    <tr>
      <td><strong>Step</strong></td>
      <td><strong>Task</strong></td>
      <td><strong>Expected Result</strong></td>
      <td><strong>Actual Result</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Click the Sign button.</td>
      <td>The MSign sign page is displayed to the user.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
    <tr>
      <td>2</td>
      <td>Select a signing instrument that asks for a PIN or confirmation while signing (such as Mobile Signature) and cancel the signing</td>
      <td>MSign displays that signature failed with a meaningful reason.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
    <tr>
      <td>3</td>
      <td>Review the MSign message and click OK to continue</td>
      <td>The browser re-displays the e-Services page that clearly shows that the signature failed.
      <br>Note that calling GetSignResponse for this request will return a response with SignStatus = Failure</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
  </tbody>
</table>

###**Case #3**

<table>
  <tbody>
    <tr>
      <td><strong>Test Case ID</strong></td>
      <td colspan="3">TC_FUNCT_03</td>
    </tr>
    <tr>
      <td><strong>Description</strong></td>
      <td colspan="3">Check sign request re-sending</td>
    </tr>
    <tr>
      <td><strong>Applicable for</strong></td>
      <td colspan="3">List of browsers as specified in requirements</td>
    </tr>
    <tr>
      <td><strong>Requirements</strong></td>
      <td colspan="3">REQ_FUNCT_XX</td>
    </tr>
    <tr>
      <td><strong>Initial Conditions</strong></td>
      <td colspan="3">Open the e-Service under test in a browser window. Go through the e-Service web pages, enter the data or upload the document to be signed and navigate to the page with Sign button, in order to perform the signing.</td>
    </tr>
    <tr>
      <td><strong>Step</strong></td>
      <td><strong>Task</strong></td>
      <td><strong>Expected Result</strong></td>
      <td><strong>Actual Result</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Click the Sign button.</td>
      <td>The MSign sign page is displayed to the user.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
    <tr>
      <td>2</td>
      <td>Go back to the e-Service page and click Sign button again.</td>
      <td>The MSign sign page is displayed to the user.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
  </tbody>
</table>

###**Case #4**

<table>
  <tbody>
    <tr>
      <td><strong>Test Case ID</strong></td>
      <td colspan="3">TC_FUNCT_04</td>
    </tr>
    <tr>
      <td><strong>Description</strong></td>
      <td colspan="3">Check correct error handling</td>
    </tr>
    <tr>
      <td><strong>Applicable for</strong></td>
      <td colspan="3">List of browsers as specified in requirements</td>
    </tr>
    <tr>
      <td><strong>Requirements</strong></td>
      <td colspan="3">REQ_FUNCT_XX</td>
    </tr>
    <tr>
      <td><strong>Initial Conditions</strong></td>
      <td colspan="3">Open the e-Service under test in a browser window. Go through the e-Service web pages, enter the data or upload the document to be signed and navigate to the page with Sign button, in order to perform the signing.</td>
    </tr>
    <tr>
      <td><strong>Step</strong></td>
      <td><strong>Task</strong></td>
      <td><strong>Expected Result</strong></td>
      <td><strong>Actual Result</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Use some invalid data (such as invalid ExpectedSigner.ID, invalid MSISDN) and click the Sign button.</td>
      <td>The e-Service displays some error message and does not redirect to MSign.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
  </tbody>
</table>

###**Case #5**

<table>
  <tbody>
    <tr>
      <td><strong>Test Case ID</strong></td>
      <td colspan="3">TC_FUNCT_05</td>
    </tr>
    <tr>
      <td><strong>Description</strong></td>
      <td colspan="3">Check valid signature verification functionality</td>
    </tr>
    <tr>
      <td><strong>Applicable for</strong></td>
      <td colspan="3">List of browsers as specified in requirements</td>
    </tr>
    <tr>
      <td><strong>Requirements</strong></td>
      <td colspan="3">REQ_FUNCT_XX</td>
    </tr>
    <tr>
      <td><strong>Initial Conditions</strong></td>
      <td colspan="3">Sign some data or document in the integrated e-Service (i.e. follow TC_FUNCT_01) and navigate to the page with Verify button, in order to perform the verification.</td>
    </tr>
    <tr>
      <td><strong>Step</strong></td>
      <td><strong>Task</strong></td>
      <td><strong>Expected Result</strong></td>
      <td><strong>Actual Result</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Click on Verify button.</td>
      <td>The e-Service displays a clearly visible successful signature verification result.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
  </tbody>
</table>

###**Case #6**

<table>
  <tbody>
    <tr>
      <td><strong>Test Case ID</strong></td>
      <td colspan="3">TC_FUNCT_06</td>
    </tr>
    <tr>
      <td><strong>Description</strong></td>
      <td colspan="3">Check valid signature verification functionality</td>
    </tr>
    <tr>
      <td><strong>Applicable for</strong></td>
      <td colspan="3">List of browsers as specified in requirements</td>
    </tr>
    <tr>
      <td><strong>Requirements</strong></td>
      <td colspan="3">REQ_FUNCT_XX</td>
    </tr>
    <tr>
      <td><strong>Initial Conditions</strong></td>
      <td colspan="3">Sign some data or document in the integrated e-Service (i.e. follow TC_FUNCT_01) and navigate to the page with Verify button, in order to perform the verification. Modify the signed data, document or the actual signature (if possible) directly in the database or in the resulting binary files.</td>
    </tr>
    <tr>
      <td><strong>Step</strong></td>
      <td><strong>Task</strong></td>
      <td><strong>Expected Result</strong></td>
      <td><strong>Actual Result</strong></td>
    </tr>
    <tr>
      <td>1</td>
      <td>Click on Verify button.</td>
      <td>The e-Service displays a clearly visible failed signature verification result.</td>
      <td><strong>Pass / Fail</strong></td>
    </tr>
  </tbody>
</table>

##**Integrations review and audit**

There are no special requirements related to integration review.