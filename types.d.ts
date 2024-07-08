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