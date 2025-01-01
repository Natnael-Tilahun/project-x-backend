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

export enum MappingPathPrefix {
  ENQUIRY_FORM_INPUT_PREFIX = "$enquiryFormInput.",
  ENQUIRY_API_RESPONSE_PREFIX = "$enquiryApiResponse.",
  PAYMENT_FORM_INPUT_PREFIX = "$paymentFormInput.",
  NOTIFY_API_RESPONSE_PREFIX = "$notifyApiResponse.",
  CURRENT_CUSTOMER_PREFIX = "$currentCustomer.",
  DEBITED_ACCOUNT_PREFIX = "$debitedAccount.",
  CREDITED_ACCOUNT_PREFIX = "$creditedAccount.",
  TRANSACTION_PREFIX = "$transaction.",
}

export enum MenuLayoutType {
  GRID = "GRID",
  LIST = "LIST",
}

export enum PaginationType {
  PAGINATED = "PAGINATED",
  INFINITE_SCROLL = "INFINITE_SCROLL",
  NONE = "NONE",
}

export enum BodyType {
   none="none", 
   application_json = "application/json",
   application_xml = "application/xml",
   application_octet_stream = "application/octet-stream",
   application_graphql="application/graphql",
   application_ld_json="application/ld+json", 
   application_x_custom="application/x-custom" ,
   text_plain="text/plain", 
   text_html="text/html", 
   text_css = "text/css", 
   application_javascript = "application/javascript",
   text_markdown = "text/markdown",
   text_csv = "text/csv",
   text_xml = "text/xml",
   application_pdf = "application/pdf",
   application_zip = "application/zip",
   application_x_www_form_urlencoded = "application/x-www-form-urlencoded",
   multipart_form_data="multipart/form-data",
   multipart_mixed="multipart/mixed", 
   multipart_alternative="multipart/alternative", 
   text_rtf = "text/rtf",
   text_vcard = "text/vcard",
   application_vnd_ms_excel="application/vnd.ms-excel", 
   application_msword= "application/msword", 
   application_vnd_ms_powerpoint="application/vnd.ms-powerpoint",
    application_atom_xml="application/atom+xml", 
    application_rss_xml="application/rss+xml", 
    application_vnd_api_json="application/vnd.api+json", 
    application_cbor="application/cbor", 
    application_vnd_google_earth_kml_xml="application/vnd.google-earth.kml+xml",
     application_x_sh="application/x-sh", 
     application_x_httpd_php="application/x-httpd-php",
      application_gzip="application/gzip", 
      application_x_tar="application/x-tar", 
      application_x_7z_compressed="application/x-7z-compressed",
       application_x_shockwave_flash="application/x-shockwave-flash", 
       application_vnd_mapbox_vector_tile="application/vnd.mapbox-vector-tile", 
       image_jpeg="image/jpeg", 
       image_png="image/png",
       image_gif="image/gif", 
       image_svg_xml="image/svg+xml", 
       image_webp="image/webp", 
       image_bmp="image/bmp", 
       image_tiff="image/tiff", 
       image_vnd_microsoft_icon="image/vnd.microsoft.icon", 
       audio_mpeg="audio/mpeg", 
       audio_ogg="audio/ogg", 
       audio_wav="audio/wav", 
       audio_flac="audio/flac",
        audio_aac="audio/aac", 
        audio_webm="audio/webm", 
        video_mp4="video/mp4", 
        video_ogg="video/ogg",
        video_webm="video/webm",
         video_x_msvideo="video/x-msvideo", 
         video_x_flv="video/x-flv",
          video_mpeg="video/mpeg", 
          font_woff="font/woff", 
          font_woff2="font/woff2",
           font_ttf="font/ttf",
            font_otf="font/otf", 
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  NONE = 'NONE',
}

