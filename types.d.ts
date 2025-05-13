import {
  ChargeType,
  LanguageRelatedStatus,
  PaymentIntegrationType,
} from "@/global-types";
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
  Platform,
  UpdatePolicy,
  AppVersionStatus,
  SystemMenuType,
  PermissionType,
  ServiceType,
  ServiceDefinitionStatus,
  PermissionGroupStatus,
  RoleScope,
  DeviceType,
  Gender,
  PaymentCategory,
  RuleType,
  ChargeType,
} from "@/global-types";

interface User {
  id?: string | null;
  login: string;
  email?: string | null;
  phone: string;
  nationalId?: string | null;
  activated?: boolean;
  langKey?: string | null;
  imageUrl?: string | null;
  verificationKey?: string | null;
  resetKey?: string | null;
  resetDate?: string | null;
  deviceId?: string | null;
  unsuccessfulLoginAttempts?: number | null;
  lockCount?: number | null;
  isUserAccountLocked?: boolean | null;
  lockoutDateTime?: string | null;
  preferredOtpMethod?: string | null;
  isPinSet?: boolean | null;
  currentLoginTime?: string | null;
  lastLoginTime?: string | null;
  forcePinChange?: boolean | null;
  emailVerified?: boolean | null;
  verified?: boolean | null;
  createdBy?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: string | null;
  isEnrolled?: boolean | null;
  authorities?: string[] | null;
}

interface Device {
  id?: string | null;
  deviceId: string;
  deviceName?: string | null;
  deviceType?: DeviceType | null;
  osVersion?: string | null;
  country?: string | null;
  city?: string | null;
  state?: string | null;
  timeZone?: string | null;
  isp?: string | null;
  ipAddress?: string | null;
  locale?: string | null;
  userAgent?: string | null;
  requestSource?: string | null;
  appVersion?: string | null;
  platform?: string | null;
  osFamily?: string | null;
  deviceFamily?: string | null;
  userAgentFamily?: string | null;
  createdBy?: string | null;
  createdDate?: string | Date | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: string | Date | null;
  active?: boolean;
  suspended?: boolean;
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
  description?: string;
  disabled: boolean;
  enforce2fa: boolean;
  permissionUsageData?: Permission[];
  scope: RoleScope;
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
  type: PermissionType;
  selected?: boolean;
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
  alternateId?: string;
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
  visiblity?: Visibility | null;
  confirmRecipientIdentity?: boolean | null;
  reEnquirePaymentDetailBeforePayment?: boolean | null;
  singleFormPayment?: boolean | null;
  isImage?: boolean | null;
  dailyLimitPerAccount?: number | null;
  limitPerTransaction?: number | null;
  category?: PaymentCategory | null;
  charge?: Charge | null
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
  isSystemMenu?: boolean | null;
  systemMenuType?: SystemMenuType | null;
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

interface Application {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  platform: Platform;
  downloadUrl: string;
  bundleId: string;
  appStoreId: string;
  description: string;
  iconUrl: string;
  enabled: boolean;
  versions: AppVersion[];
}

interface AppVersion {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: string;
  application: Application;
  versionName: string;
  versionNumber: string;
  buildNumber: string;
  minRequiredVersion: string;
  apiKeyHash: string;
  allowedChecksum: string;
  releaseNotes: string;
  releaseDate: string;
  updatePolicy: UpdatePolicy;
  isRevoked: boolean;
  enabled: boolean;
  status: AppVersionStatus;
}

interface Contract {
  id?: string | null;
  name: string | null;
  description?: string | null;
  serviceType?: ServiceType | null;
  serviceDefinition?: ServiceDefinition | null;
  permissionCodes?: string[] | null;
  inheritParentServicePermissions?: boolean | null;
  coreCustomers?:
    | [
        {
          coreCustomerId: string;
          inheritParentContractPermissions: boolean;
          permissionCodes?: string[] | null;
          coreAccounts:
            | [
                {
                  inheritContractCustomerPermissions: boolean;
                  permissionCodes?: string[] | null;
                  accountNumber: string;
                }
              ]
            | null;
        }
      ]
    | null;
  permissions?: Permissions[];
}

interface ServiceDefinition {
  id?: string | null;
  name: string;
  description?: string | null;
  serviceType: ServiceType;
  defaultGroup?: string | null;
  numberOfFeatures?: number | null;
  numberOfActiveRoles?: number | null;
  numberOfRoles?: number | null;
  numberOfContracts?: number | null;
  status?: ServiceDefinitionStatus | null;
  service?: BankingService | null;
  permissions?: Permission[] | null;
}

interface BankingService {
  id: string;
  serviceType: ServiceType;
  serviceName?: string;
  description?: string | null;
}

interface ServiceDefinition {
  id?: string;
  name: string;
  description: string;
  serviceType: ServiceType;
  defaultGroup: string;
  numberOfFeatures: number;
  numberOfActiveRoles: number;
  numberOfRoles: number;
  numberOfContracts: number;
  status: ServiceDefinitionStatus;
  service: BankingService;
  permissions: Permission[];
}

interface ServiceDefinitionRole {
  id?: string;
  isDefault?: boolean;
  serviceDefinition: ServiceDefinition;
  permissions?: Permission[];
  roleName: string;
  roleDescription: string;
}

interface PermissionGroup {
  groupCode: string;
  name?: string;
  description?: string;
  scope: RoleScope;
  status?: PermissionGroupStatus;
}

interface ContractCoreCustomer {
  id?: string;
  enable?: boolean;
  coreCustomerId: string;
  contract?: Contract;
  permissions?: Permission[];
  coreAccounts?: Account[];
  isPrimary?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  salutation?: string;
  gender?: Gender;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface ContractAccount {
  id?: string;
  enable?: boolean;
  coreCustomer?: ContractCoreCustomer;
  contract?: Contract;
  permissions?: Permission[];
  account?: Account;
}

interface ContractUser {
  id?: string;
  enable?: boolean;
  isPrimaryUser?: boolean;
  contract?: Contract;
  user?: User;
  customer?: Customer;
  serviceDefinitionRole?: ServiceDefinitionRole;
}

// Update the interface to match the actual data structure
interface Account {
  id?: string | null;
  accountNumber: string;
  customerId?: string;
  accountCategoryId: string;
  accountTitle1: string;
  jointAccountHolder1: string | null;
  jointAccountHolder2: string | null;
  currency: string;
  onlineActualBalance: string;
  onlineClearedBalance: string;
  workingBalance: string;
  openingDate?: string;
  dateLastUpdate?: string;
  inactivMarker?: string;
  postingRestrictId?: string;
  accountType?: string | null;
  availableBalance?: string | null;
  lastUpdated?: string | Data | null;
  accountHolder?: string | null;
}

interface Staff {
  id?: string | null;
  firstname: string;
  lastname: string;
  displayName?: string | null;
  username?: string | null
  mobileNo?: string | null;
  emailAddress: string | null;
  active?: boolean | null;
  joiningDate?: string | null;
}

interface Office {
  id: string;
  name: string;
  code?: string | null;
  state?: string | null;
  organizationRegion?: string | null;
  districtName?: string | null;
  description?: string | null;
  hierarchy?: string | null;
  openingDate: string;
  parent?: string | null;
}

interface StaffAssignment {
  id?: string;
  assignmentDate?: string | null;
  // endDate?: string | null;
  staffId: string;
  supervisorStaffId?: string | null;
  newOfficeId: string;
  newRoleId: string;
  remarks?: string | null
}

interface UssdLanguage {
  id?: string;
  languageType: string;
  languageName: string;
  status: LanguageRelatedStatus;
}

interface DefaultMessage {
  id?: string;
  message: string;
  title: string;
  language: Language;
}

interface LocalizedDefaultMessage {
  id?: string;
  defaultMessage: DefaultMessage;
  language: UssdLanguage;
  message: string;
  status: any;
}

interface UssdMenuList {
  id: string;
  menuName: string;
  visible: boolean;
  displayOrder: number;
  child?: UssdMenuList[] | null;
}

interface LocalizedUssdMenu {
  id?: string;
  menuLanguageId: any;
  languageId: string;
  message: string;
  status: LanguageRelatedStatus;
  language: UssdLanguage;
  defaultMenu: DefaultMessage;
}

interface Charge {
  id?: number;
  chargeCode?: string;
  category?:string;
  type: ChargeType;
  description: string;
  shortDescription?: string;
  categoryAccount?: string;
  isActive: boolean;
  rules?: ChargeRule[] | null;
}

interface ChargeRule {
  id?: number;
  ruleType: RuleType;
  amountRangeStart?: number;
  amountRangeEnd?: number;
  fixedAmount?: number;
  percentage?: number;
  priority: number;
  charge?: Charge | null;
}
