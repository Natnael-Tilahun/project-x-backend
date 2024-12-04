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
  
