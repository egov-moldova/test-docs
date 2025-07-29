#Securitate

##**Authentication**

Toate apelările MPower Clients API se pot face de către sistemele autentificate. Autentificarea se realizează prin intermediul certificatului de autentificare.

Informații privind obținerea și înregistrarea certificatului se pot vedea în Cap. 7 Implementare integrărilor.

##**Autorizarea accesului**

Pentru accesarea componentei MPower Clients API este necesar utilizarea certificatului de autentificare a sistemului emis de STISC și înregistrat de AGE în MPass.

MPower Client API va apela [https://mpower.staging.egov.md:8443/clients-api/api/authorization/check/](https://mpower.staging.egov.md:8443/clients-api/api/authorization/check/) și va folosi pentru autentificare certificatul sistemului care se integrează cu MPower. În calitate de răspuns se va primi o listă a drepturilor atribuite în conformitate cu certificatul sistemului și ca urmare accesul se va realiza în baza drepturilor alocate.

Exemple configurări în MPass:

=== "Setări JSON"

    ``` json 
    {
        "AllowedEndpoints": [
            "/api/Authorization/check/Code-True-One",
            "/api/Authorization/check/Code-Details-One",
            "/api/Authorization/check/TypeCode-Valid-One",
            "/api/Authorization/check/Idn-Details-List",
        ],
        "ViewAllAuthorizations": false
    }
    ```
!!! note "Notă"

     **"AllowedEndpoints"** - specifică lista de endpoint-uri la care sistemul terț are acces.
     <br>**"ViewAllAuthorizations"** - true/false : true – este asigurat accesul la toate IR sau false – accesul la IR exclusiv al prestatorului de serviciu.

##**Criptarea**
Comunicarea cu componenta MPower REST API este criptată utilizând protocolul standard TLS (HTTPS).