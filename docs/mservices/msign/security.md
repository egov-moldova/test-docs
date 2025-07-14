#Security considerations

##**Authentication**

All calls to MSign operations are authenticated by MSign. The authentication is performed by using the client certificate used for HTTPS transport.

For information regarding obtaining a client certificate and registration, see Obtaining credentials and Consumer registration and network access.

<span class="red-bold-text">Important.</span> The description of the process of installing, registering or explicitly trusting the obtained client certificate in the operating system or framework used by the integrating e-Service has to be done accordingly, is specific to that environment and it’s out of the scope of this document.

##**Authorization**

After successful authentication, all registered service consumers are authorized to invoke all of the exposed operations.

In the case of requesting a SignResponse that was originally placed by another service consumer, MSign will return a fault with AuthorizationFailed fault code.

##**Encryption**
All communication with MSign SOAP service is encrypted by using standard TLS protocol (HTTPS). The client certificate used to initiate the encrypted transport is also used for Authentication.