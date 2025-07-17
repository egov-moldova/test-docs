#Security considerations

!!! note 

    The following security considerations must be taken into account while developing an integration with MPass.

##**Authentication**

MPass performs integrating systems authentication by verifying the signature of requests, which MUST be signed by using the private key of the requesting system.

MPass uses X509 certificates for system registration and actual signature verification.

<span class="red-bold-text">Important.</span> The description of the process of installing, registering or explicitly trusting the certificate and any certificate chain in the operating system or framework used by the integrating information systems has to be done accordingly, is specific to that environment and it’s out of the scope of this document.

Integrating systems MUST accept and handle only valid MPass messages (SAML Response, LogoutResponse, as well as SAML SLO LogoutRequest).

The following checks MUST be performed for a correct and complete MPass message verification:

1. Verify SAML message signature and/or SAML assertion signature.
2. Check whether the SAML message is not expired (using some absolute configurable timeout and taking into account some expected time differences between servers’ clocks) of the following SAML attributes, depending on your needs:
    
    1. @IssueInstant – always verify;
    2. Response/Assertion/AuthnStatement/@AuthnInstant – verify when you need to see how long ago the user has authenticated;
    3. Response/Assertion/Conditions/@NotOnOrAfter – verify when SAML assertion is signed;
    4. Response/Assertion/AuthnStatement/@SessionNotOnOrAfter – verify in special cases.

3. Check SAML message destination and/or audience:
    
    1. @Destination – always verify;
    2. Response/Assertion/Subject/SubjectConfirmation /SubjectConfirmationData/@Recipient – verify when SAML assertion is signed;
    3. Response/Assertion/Conditions/AudienceRestriction/Audience – always verify.

4. Check SAML responses to see if they have been initiated by your Service:

    1. Response/@InResponseTo – always verify;
    2. Response/Assertion/Subject/SubjectConfirmation/SubjectConfirmationData/@InResponseTo – verify when SAML assertion is signed.

5. Always check SAML response status code for Success in Response/Status/StatusCode/@Value attribute. The response MUST be handled as invalid whenever this code has a different value.

For more details and a comprehensive understanding of all security considerations, please refer to the following SAML standards document sections: [SAML Core, 3.2], [SAML Bindings, 3.5.5], [SAML Profiles, 4.1.4.3] and [SAML Security Considerations, 6.4].

##**Authorization**

MPass does not perform actual authorization of the integrating systems or users by itself. MPass is a convenient user management instrument and acts as what is commonly referred to as Policy Information Point (PIP) and Policy Retrieval Point (PRP).

On user authentication MPass can return custom authorization attributes as configured in service registration. Actual authorization decision must be taken by integrating systems based on the set of returned attributes for the authenticated identity. This means that the systems act as actual Policy Decision Point (PDP) and Policy Enforcement Point (PEP), i.e. the actual decision, its correctness and enforcement is the responsibility of the integrating systems.

##**Confidentiality**
To maintain the confidentiality of the attributes related to authenticated identities, integrating systems MUST use some encryption mechanism. Considering that the integrating systems are web-based, this means that all interactions with user’s browser during authentication and logout MUST be performed using HTTPS (TLS).

Note that, although MPass can encrypt and sign SAML Assertions, this feature shall not be considered as enough for maintaining confidentiality.