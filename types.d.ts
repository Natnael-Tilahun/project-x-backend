import { PaymentIntegrationType } from "@/global-types";
import { TransactionAmountType } from "@/global-types";
import {
  Visibility,
  PaymentOperationType,
  FormType,
  LogicalOperators,
  InputType,
  DataType,
  TransferMapping,
  AuthType,
  Protocol,
  Auth,
  IntegrationType,
  MenuLayoutType,
  PaginationType,
  Operators,
  OperatorToCompareValue,
  ResponseScope,
  TransferCoreMapping,
  ValueSource,
  OperatorToCompareValue,
  ResponseScope,
  TransferCoreMapping,
  ValueSource,
  RetryStrategy,
  GenerationType,
  DateStepUnit,
  InterfaceType,
  AutoCompleteTrigger,
  Display,
  Width,
  MaximumAmountVariableType,
  MinimumAmountVariableType,
  CreditAccountNumberVariableType,
} from "@/global-types";

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
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  name: string;
  description: string;
  disabled: boolean;
  enforce2fa: boolean;
  permissionUsageData?: Permission[];
}

interface Permission {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  grouping: string;
  code: string;
  entityName: string;
  actionName: string;
  description: string & {
    min: 0;
    max: 50;
  };
  selected?: boolean;
}

enum Gender {
  Male = "Male",
  Female = "Female",
  None = "None",
}

enum Status {
  ACTIVE = "Active",
  LOCKED = "Locked",
  SUSPENDED = "Suspended",
  INACTIVE = "Inactive",
  PENDING = "Pending",
  UNENEOLLED = "UnEnrolled",
  NEW = "New",
}

interface Profile {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  id?: string;
  login: string & {
    maxLength: 50;
    minLength: 1;
  };
  email?: string;
  phone?: string & {
    maxLength: 30;
    minLength: 8;
  };
  newPhone?: string;
  newEmail?: string;
  newEmailKey?: string;
  newEmailExpiration?: Date;
  activated: boolean;
  langKey?: string;
  maxLength?: 10;
  minLength?: 2;
  imageUrl?: string;
  maxLength?: 256;
  minLength?: 0;
  resetDate?: Date;
  deviceId?: string;
  unsuccessfulLoginAttempts?: number;
  lockCount?: number;
  lockoutDateTime?: Date;
  preferredOtpMethod?: string;
  currentLoginTime?: Date;
  lastLoginTime?: Date;
  forcePinChange?: boolean;
  emailVerified?: boolean;
  verified?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
}

interface Customer {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  salutation: string;
  gender: Gender;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  login: string;
  email: string;
  phone: string;
  nationalId: string;
  activated: boolean;
  langKey: string;
  imageUrl: string;
  verificationKey: string;
  resetKey: string;
  resetDate: string;
  deviceId: string;
  unsuccessfulLoginAttempts: number;
  lockCount: number;
  isUserAccountLocked: boolean;
  lockoutDateTime: string;
  preferredOtpMethod: string;
  coreCustomerId?: string | null;
  legacyCustomerId?: string | null;
  branchId?: string | null;
  status?: Status;
  isPinSet: boolean;
  currentLoginTime: string;
  lastLoginTime: string;
  emailVerified: boolean;
  verified: boolean;
  isEnrolled: boolean;
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
  staffMember?: boolean;
  roles: [Role];
}

interface Address {
  city: string;
  businessEmail: string;
  postalNumber: string;
}

interface Merchant {
  customerIdId: string;
  merchantId?: string;
  businessType: string;
  businessNumber: string;
  businessName: string;
  tradeLicenseNumber: string;
  tradeLicenseIssueDate: string;
  tradeLicenseExpiryDate: string;
  taxPayerIdNumber: Gender;
  taxPayerIssueDate: string;
  taxPayerExpiryDate: string;
  businessPhoneNumber: string;
  faxNumber: string;
  address: Address;
  shortCode: string;
  status: Status;
}

interface Integration {
  id: string;
  isDraft: boolean;
  integrationName: string;
  companyName: string;
  description: string;
  iconPath: string;
  enabled: boolean;
  accountNumber: string;
  minimumAmount: number;
  maximumAmount: number;
  currencyCode: string;
  paymentConfirmationTemplate: string;
  paymentDetailTemplate: string;
  paymentSuccessTemplate: string;
  paymentErrorTemplate: string;
  integrationCategory: string;
  paymentSuccessTemplate: string;
}

enum HttpMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  NONE = "NONE",
}

interface ApiOperation {
  id: string;
  operationName: string;
  httpMethod: HttpMethod;
  bodyType?: BodyType;
  endpointPath: string;
  requestBodyTemplate?: string;
  responseOutputs?: [];
  requestInputs?: [];
  integrationOperations?: string;
  apiIntegration?: ApiIntegration;
  apiOperationPath?: string;
}

interface ApiIntegration {
  id: string;
  name: string;
  url: string;
  type: IntegrationType;
  // auth: Auth;
  description?: string;
  version?: string;
  timeout?: number;
  retryStrategy?: RetryStrategy;
  retryRetries?: number;
  retryDelay?: number;
  apiOperations: [ApiOperation];
  apiIntegrationPath?: string;
  authConfig?: AuthConfiguration;
  protocol?: Protocol;
  host?: string;
}

enum ResponseScope {
  RESPONSE = "RESPONSE",
  HEADER = "HEADER",
  ERROR = "ERROR",
  NONE = "NONE",
}

enum TransferCoreMapping {
  AMOUNT = "AMOUNT",
  CREDIT_ACCOUNT = "CREDIT_ACCOUNT",
  REASON = "REASON",
  NONE = "NONE",
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
  NONE = "NONE",
}

interface ResponseOutput {
  id: string;
  outputName: string;
  dataType: DataType;
  responseValuePath: string;
  responseScope: ResponseScope;
  isRequired: boolean;
  apiOperation: ApiOperation;
  integrationFieldMappings?: [IntegrationFieldMapping];
  validationConfig?: ValidationConfig | null;
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
  PROFILE = "PROFILE",
}

interface IntegrationFieldMapping {
  id: string;
  sourceType: ValueSource;
  dataKey: string;
}

interface ValidationRule {
  operator: Operators;
  against: string | number;
  errorMessage: string;
}

interface RequestInput {
  id: string;
  inputName: string;
  inputType: InputType;
  dataType: DataType;
  testValue?: string;
  defaultValue?: string;
  isEncoded?: boolean;
  maxLength?: number;
  minLength?: number;
  minValue?: string;
  maxValue?: string;
  validationPattern?: string;
  transformationRule?: string;
  isRequired?: boolean;
  isHidden?: boolean;
  apiOperation?: ApiOperation;
  integrationFieldMappings?: [IntegrationFieldMapping];
  validationConfig?: ValidationConfig | null;
}

interface PaymentIntegration {
  id?: string;
  defaultLanguageCode?: string | null;
  integrationName?: string | null;
  companyName?: string | null;
  description?: string | null;
  iconPath?: string | null;
  isDraft?: boolean | null;
  enabled?: boolean | null;
  accountNumber?: string | null;
  minimumAmount?: number | null;
  maximumAmount?: number | null;
  maximumAmountVariableType?: MaximumAmountVariableType | null;
  minimumAmountVariableType?: MinimumAmountVariableType | null;
  creditAccountNumberVariableType?: CreditAccountNumberVariableType | null;
  transactionAmountType?: TransactionAmountType | null;
  // amountEnquiryPath?: string | null;
  // maximumAmountEnquiryPath?: string | null;
  // minimumAmountEnquiryPath?: string | null;
  // creditAccountNumberEnquiryPath?: string | null;
  currencyCode?: string | null;
  paymentConfirmationTemplate?: string | null;
  paymentDetailTemplate?: string | null;
  paymentSuccessTemplate?: string | null;
  paymentErrorTemplate?: string | null;
  paymentConfirmationTemplateShort?: string | null;
  paymentDetailTemplateShort?: string | null;
  paymentSuccessTemplateShort?: string | null;
  paymentErrorTemplateShort?: string | null;
  defaultPaymentReason?: string | null;
  integrationType?: PaymentIntegrationType | null;
  visibility?: Visibility | null;
  confirmRecipientIdentity?: boolean | null;
  reEnquirePaymentDetailBeforePayment?: boolean | null;
  singleFormPayment?: boolean | null;
  isImage?: boolean | null;
}

interface Menu {
  id?: string;
  defaultLanguageCode?: string | null;
  menuName?: string | null;
  menuDescription?: string | null;
  iconPath?: string | null;
  enabled?: boolean | null;
  productMenus?: PaymentIntegration[] | null;
  parent?: Menu | null;
  children?: Menu[] | null;
  menuLayoutType?: MenuLayoutType | null;
  gridNumberOfColumns?: number | null;
  sortOrder?: number | null;
  paginationType?: PaginationType | null;
  paginationSize?: number | null;
  isSuperParent?: boolean | null;
  isImage?: boolean | null;
}

interface Local {
  defaultLanguageCode?: string | null;
  localName?: string | null;
}

interface ApiRequestMappingsRegistry {
  apiRequestInputName: string;
  mappingPath: string;
}

interface PaymentOperation {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  paymentOperationType?: PaymentOperationType | null;
  nextPaymentOperation?: PaymentOperation | null;
  prevPaymentOperation?: PaymentOperation | null;
  paymentIntegration?: PaymentIntegration | null;
  apiOperation?: ApiOperation | null;
  form?: Form | null;
  apiRequestMappingsRegistry?: ApiRequestMappingsRegistry[] | null;
  amountEnquiryPath?: string | null;
  maximumAmountEnquiryPath?: string | null;
  minimumAmountEnquiryPath?: string | null;
  creditAccountNumberEnquiryPath?: string | null;
}

interface Field {
  id?: string;
  defaultLanguageCode?: string | null;
  dataType?: DataType | null;
  isUnique?: boolean | null;
  name?: string | null;
  label?: string | null;
  maxLength?: number | null;
  minLength?: number | null;
  minValue?: string | null;
  maxValue?: string | null;
  defaultValue?: boolean | null; //changed
  isRequired?: boolean | null;
  readonly?: boolean | null;
  transferMapping?: TransferMapping | null;
  sortOrder?: number | null;
  width?: Width | null;
  validationPattern?: string | null;
  autoGenerateConfig?: AutoGenerateConfig | null;
  isHidden?: boolean | null;
  interfaceType?: InterfaceType | null;
  options?: Options | null;
  display?: Display | null;
  displayOptions?: DisplayOptions | null;
  validationConfig?: ValidationConfig | null;
  validationMessage?: string | null;
  form?: Form | null;
  rememberValue?: boolean | null;
  rememberExpiryDays?: number | null;
}

interface AutoGenerateConfig {
  enabled: boolean;
  generationType: GenerationType;
  dataType: DataType;
  prefix: string;
  suffix: string;
  length: number;
  allowManualOverride: boolean;
  minValue: number;
  maxValue: number;
  step: number;
  padding: boolean;
  paddingLength: number;
  reservedValues: number[];
  excludePatterns: string[];
  pattern: string;
  allowedChars: string;
  uuidVersion: number;
  uuidNamespace: string;
  startDate: string;
  startDateTime: string;
  dateFormat: string;
  dateTimeFormat: string;
  timezone: string;
  dateStep: number;
  dateStepUnit: DateStepUnit;
  unique: boolean;
  retryAttempts: number;
  collisionStrategy: string;
  logValues: boolean;
  auditEnabled: boolean;
  obfuscation: boolean;
  encryption: boolean;
  dependentOn: string;
  customRule: string;
  batchSize: number;
  concurrency: number;
  validationRegex: string;
  postValidation: boolean;
}

interface Choice {
  text: string;
  value: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

interface Options {
  placeholder?: string | null;
  iconLeft?: string | null;
  clear?: boolean | null;
  font?: string | null;
  trim?: boolean | null;
  masked?: boolean | null;
  slug?: boolean | null;
  choices?: Choice[] | null;
  allowOther?: boolean | null;
  allowNone?: boolean | null;
  url?: string | null;
  resultsPath?: string | null;
  autoCompleteTrigger?: AutoCompleteTrigger | null;
  minValue?: number | null;
  maxValue?: number | null;
  stepInterval?: number | null;
  alwaysShowValue?: boolean | null;
}

interface DisplayOptions {
  format?: boolean | null;
  bold?: boolean | null;
  color?: string | null;
  background?: string | null;
  icon?: string | null;
  masked?: boolean | null;
  prefix?: string | null;
  suffix?: string | null;
  font?: string | null;
  italic?: boolean | null;
  border?: boolean | null;
  relative?: boolean | null;
  strict?: boolean | null;
  labelOn?: string | null;
  labelOff?: string | null;
  colorOn?: string | null;
  colorOff?: string | null;
  iconOn?: string | null;
  iconOff?: string | null;
}

interface ValidationConfig {
  logicalOperator?: LogicalOperators | null;
  validationRules?: ValidationRule[] | null;
}

interface Form {
  id?: string;
  defaultLanguageCode?: string | null;
  formName?: string | null;
  formDescription?: string | null;
  formType?: FormType | null;
  stepOrder?: number | null;
  paymentOperation?: PaymentOperation | null;
  paymentIntegration?: PaymentIntegration | null;
  locals?: string[] | null;
  fields?: Field[] | null;
}

interface AuthConfiguration {
  id?: string | null;
  authType: AuthType;
  authConfigName?: string | null;
  authConfigDescription?: string | null;
  username?: string | null;
  password?: string | null;
  clientId?: string | null;
  clientSecret?: string | null;
  tokenUrl?: string | null;
  redirectUri?: string | null;
  codeVerifier?: string | null;
  scope?: string | null;
  grantType?: string | null;
  codeChallenge?: string | null;
  apiKey?: string | null;
  jwtToken?: string | null;
  currentToken?: string | null;
  sessionCookie?: string | null;
  additionalParams?: {
    [key: string]: string;
  } | null;
  customAuthOperation?: ApiOperation | null;
  apiIntegration?: ApiIntegration | null;
}
