interface User {
  email: string;
  id: string;
  password: string;
  role: string[];
}

interface UserInput {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface UserWithoutPassword {
  email: string;
  id: string;
  role: string[];
}

interface Role {
  createdBy?: string
  createdDate?: Date
  lastModifiedBy?: string
  lastModifiedDate?: Date
  name: string
  description: string
  disabled: boolean
  enforce2fa: boolean
  permissionUsageData?: Permission[]
}

interface Permission {
  createdBy?: string
  createdDate?: Date
  lastModifiedBy?: string
  lastModifiedDate?: Date
  grouping: string
  code: string
  entityName: string
  actionName: string
  description: string & {
    min: 0,
    max: 50
  }
  selected?: boolean
}

enum Gender {
  Male = 'Male',
  Female = 'Female',
  None = 'None'
}

enum Status {
  ACTIVE = 'Active',
  LOCKED = "Locked",
  SUSPENDED = "Suspended",
  INACTIVE = 'Inactive',
  PENDING = "Pending",
  UNENEOLLED = "UnEnrolled",
  NEW = 'New'
}

interface Profile {
  createdBy?: string
  createdDate?: Date
  lastModifiedBy?: string
  lastModifiedDate?: Date
  id?: string
  login: string &
  {
    maxLength: 50
    minLength: 1
  }
  email?: string
  phone?: string &
  {
    maxLength: 30
    minLength: 8
  }
  newPhone?: string
  newEmail?: string
  newEmailKey?: string
  newEmailExpiration?: Date
  activated: boolean
  langKey?: string
  maxLength?: 10
  minLength?: 2
  imageUrl?: string
  maxLength?: 256
  minLength?: 0
  resetDate?: Date
  deviceId?: string
  unsuccessfulLoginAttempts?: number
  lockCount?: number
  lockoutDateTime?: Date
  preferredOtpMethod?: string
  currentLoginTime?: Date
  lastLoginTime?: Date
  forcePinChange?: boolean
  emailVerified?: boolean
  verified?: boolean
  firstName?: string
  middleName?: string
  lastName?: string
  phone?: string
}

interface Customer {
  id: string;
  firstName: string
  middleName: string
  lastName: string
  fullName: string
  salutation: string
  gender: Gender
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  login: string
  email: string
  phone: string
  nationalId: string
  activated: boolean
  langKey: string
  imageUrl: string
  verificationKey: string
  resetKey: string
  resetDate: string
  deviceId: string
  unsuccessfulLoginAttempts: number
  lockCount: number
  isUserAccountLocked: boolean
  lockoutDateTime: string
  preferredOtpMethod: string
  coreCustomerId?: string | null;
  legacyCustomerId?: string | null;
  branchId?: string | null;
  status?: Status
  isPinSet: boolean
  currentLoginTime: string
  lastLoginTime: string
  emailVerified: boolean
  verified: boolean
  isEnrolled: boolean
  syncTimestamp?: string | null;
  defaultAccountDeposit?: string | null;
  defaultAccountTransfers?: string | null;
  defaultAccountPayments?: string | null;
  defaultAccountCardLess?: string | null;
  defaultAccountBillPay?: string | null;
  defaultToAccountP2P?: string | null;
  defaultFromAccountP2P?: string | null;
  coreLinked?: boolean;
  customerActivated?: boolean;
  vipcustomer?: boolean;
  olbAllowed?: boolean;
  staffMember?: boolean
  roles: [Role]
}

interface Address {
  city: string;
  businessEmail: string
  postalNumber: string;
}

interface Merchant {
  customerIdId: string
  merchantId?: string
  businessType: string;
  businessNumber: string
  businessName: string
  tradeLicenseNumber: string
  tradeLicenseIssueDate: string
  tradeLicenseExpiryDate: string
  taxPayerIdNumber: Gender
  taxPayerIssueDate: string
  taxPayerExpiryDate: string
  businessPhoneNumber: string
  faxNumber: string
  address: Address
  shortCode: string
  status: Status
}

interface Integration {
  id: string
  isDraft: boolean
  integrationName: string;
  companyName: string
  description: string
  iconPath: string
  enabled: boolean
  accountNumber: string
  minimumAmount: number
  maximumAmount: number
  currencyCode: string
  paymentConfirmationTemplate: string
  paymentDetailTemplate: string
  paymentSuccessTemplate: string
  paymentErrorTemplate: string
  integrationCategory: string
  paymentSuccessTemplate: string
}

enum Auth {
  NONE = "NONE",
  BASIC = "BASIC",
  BEARER = "BEARER",
  OAUTH = "OAUTH"
}

enum HttpMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  NONE = "NONE"
}

enum IntegrationType {
  JSON = "JSON",
  SOAP = "SOAP",
  XML = "XML",
  NONE = "NONE"
}

interface ApiOperation {
  id: string
  operationName: string
  httpMethod: HttpMethod
  endpointPath: string
  requestBodyTemplate?: string
  responseOutputs?: []
  requestInputs?: []
  integrationOperations?: string
  apiIntegration?: ApiIntegration
}

interface ApiIntegration {
  id: string
  name: string
  url: string
  type: IntegrationType
  auth: Auth
  description?: string
  version?: string
  timeout?: number
  retryRetries?: number
  retryDelay?: number
  apiOperations: [ApiOperation]
}

enum ResponseScope {
  RESPONSE = "RESPONSE",
  HEADER = "HEADER",
  ERROR = "ERROR",
  NONE = "NONE"
}

enum TransferCoreMapping {
  AMOUNT = "AMOUNT",
  CREDIT_ACCOUNT = "CREDIT_ACCOUNT",
  REASON = "REASON",
  NONE = "NONE"
}

enum OperatorToCompareValue {
  EQUAL_TO = "EQUAL_TO",
  NOT_EQUAL_TO = "NOT_EQUAL_TO",
  OBJECT_ = "OBJECT_",
  OBJECT_NOT_EQUAL_TO = "OBJECT_NOT_EQUAL_TO",
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_OR_EQUAL_TO = "GREATER_THAN_OR_EQUAL_TO",
  LESS_THAN_OR_EQUAL_TO = "LESS_THAN_OR_EQUAL_TO",
  NONE = "NONE"
}

enum DataType {
  COLLECTION = "COLLECTION",
  STRING = "STRING",
  INT = "INT",
  LONG = "LONG",
  DOUBLE = "DOUBLE",
  BOOLEAN = "BOOLEAN",
  DATETIME = "DATETIME",
  NONE = "NONE"
}

interface ResponseOutput {
  id: string
  outputName: string
  dataType: DataType
  responseValuePath: string
  responseScope: ResponseScope
  transferCoreMapping: TransferCoreMapping
  isLogicField: boolean
  constantValueToCompare: string
  operatorToCompareValue: OperatorToCompareValue
  isRequired: boolean
  isVisibleForUser: boolean
  apiOperation: ApiOperation
}

enum ValueSource {
  USER_INPUT = "USER_INPUT",
  PAYMENT_DETAIL = "PAYMENT_DETAIL",
  TRANSACTION_ID = "TRANSACTION_ID",
  TRANSACTION_DETAILS = "TRANSACTION_DETAILS",
  TRANSACTION_AMOUNT = "TRANSACTION_AMOUNT",
  CUSTOMER_PHONE = "CUSTOMER_PHONE",
  CUSTOMER_EMAIL = "CUSTOMER_EMAIL",
  CUSTOMER_ACCOUNT = "CUSTOMER_ACCOUNT",
  NONE = "NONE",
  CUSTOMER = "CUSTOMER",
  TRANSACTION = "TRANSACTION",
  ACCOUNT = "ACCOUNT",
  PROFILE = "PROFILE"
}

enum InputType {
  HEADER = "HEADER",
  BODY = "BODY",
  QUERY = "QUERY",
  PATH = "PATH",
  NONE = "NONE"
}

interface IntegrationFieldMapping {
  id: string
  sourceType: ValueSource
  dataKey: string
}

interface RequestInput {
  id: string
  inputName: string
  inputType: InputType
  dataType: DataType
  testValue?: string
  defaultValue?: string
  valueSource?: ValueSource
  isEncoded?: boolean
  maxLength?: number 
  minLength?: number
  minValue?: string
  maxValue?: string
  validationPattern?: string
  transformationRule?: string
  isRequired?: boolean
  isHidden?: boolean
  apiOperation?: ApiOperation
  integrationFieldMappings?: [IntegrationFieldMapping]
}