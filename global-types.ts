export enum PaymentIntegrationType {
    PAYMENT = "PAYMENT",
    TRANSFER = "TRANSFER",
    TOPUP = "TOPUP",
    NONE = "NONE"
}

export enum TransactionAmountType {
    PREDEFINED = "PREDEFINED",
    USER_DEFINED = "USER_DEFINED",
  NONE = "NONE"
}

export enum Visibility {
  EVERYONE = "EVERYONE",
  FOR_STUFF = "FOR_STUFF",
  VIP_CUSTOMERS = "VIP_CUSTOMERS",
  FOR_TESTERS = "FOR_TESTERS",
  NONE = "NONE"
}

export enum PaymentOperationType {
    ENQUIRY = 'ENQUIRY',
    PROCESS_PAYMENT_AND_NOTIFY_WEBHOOK = 'PROCESS_PAYMENT_AND_NOTIFY_WEBHOOK',
    NONE = 'NONE',
}

export enum FormType {
    INIT = 'INIT',
    INDEX = 'INDEX',
    REMARK = 'REMARK',
    ENQUIRY = 'ENQUIRY',
    PAYMENT = 'PAYMENT',
    NONE = 'NONE',
}

export enum DataType {
    COLLECTION = 'COLLECTION',
    STRING = 'STRING',
    INT = 'INT',
    LONG = 'LONG',
    DOUBLE = 'DOUBLE',
    BOOLEAN = 'BOOLEAN',
    DATETIME = 'DATETIME',
    NONE = 'NONE',
}

export enum TransferParams {
    AMOUNT = 'AMOUNT',
    CREDIT_ACCOUNT = 'CREDIT_ACCOUNT',
    REASON = 'REASON',
    NONE = 'NONE',
  }
  
export enum AuthType {
  NONE = 'NONE',
  BASIC = 'BASIC',
  BEARER = 'BEARER',
  API_KEY = 'API_KEY',
  JWT = 'JWT',
  OAUTH1 = 'OAUTH1',
  OAUTH2 = 'OAUTH2',
  PKCE = 'PKCE',
  DEVICE_AUTHORIZATION_FLOW = 'DEVICE_AUTHORIZATION_FLOW',
  OPENID_CONNECT = 'OPENID_CONNECT',
  HMAC = 'HMAC',
  AWS_SIGV4 = 'AWS_SIGV4',
  DIGEST = 'DIGEST',
  CLIENT_CERTIFICATE = 'CLIENT_CERTIFICATE',
  SAML = 'SAML',
  LDAP = 'LDAP',
  KERBEROS = 'KERBEROS',
  SESSION_COOKIE = 'SESSION_COOKIE',
  GOOGLE_SERVICE_ACCOUNT = 'GOOGLE_SERVICE_ACCOUNT',
  AZURE_SAS_TOKEN = 'AZURE_SAS_TOKEN',
  CUSTOM_HEADER = 'CUSTOM_HEADER',
  TOKEN_EXCHANGE = 'TOKEN_EXCHANGE',
  CUSTOM_OAUTH = 'CUSTOM_OAUTH',
  OTHER = 'OTHER',
}

export enum Auth {
  NONE = 'NONE',
  BASIC = 'BASIC',
  BEARER = 'BEARER',
  API_KEY = 'API_KEY',
  JWT = 'JWT',
  OAUTH1 = 'OAUTH1',
  OAUTH2 = 'OAUTH2',
  PKCE = 'PKCE',
  DEVICE_AUTHORIZATION_FLOW = 'DEVICE_AUTHORIZATION_FLOW',
  OPENID_CONNECT = 'OPENID_CONNECT',
  HMAC = 'HMAC',
  AWS_SIGV4 = 'AWS_SIGV4',
  DIGEST = 'DIGEST',
  CLIENT_CERTIFICATE = 'CLIENT_CERTIFICATE',
  SAML = 'SAML',
  LDAP = 'LDAP',
  KERBEROS = 'KERBEROS',
  SESSION_COOKIE = 'SESSION_COOKIE',
  GOOGLE_SERVICE_ACCOUNT = 'GOOGLE_SERVICE_ACCOUNT',
  AZURE_SAS_TOKEN = 'AZURE_SAS_TOKEN',
  CUSTOM_HEADER = 'CUSTOM_HEADER',
  TOKEN_EXCHANGE = 'TOKEN_EXCHANGE',
  CUSTOM_OAUTH = 'CUSTOM_OAUTH',
  OTHER = 'OTHER',
}

export enum Protocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
}

export enum IntegrationType {
  JSON = "JSON",
  SOAP = "SOAP",
  XML = "XML",
  NONE = "NONE"
}