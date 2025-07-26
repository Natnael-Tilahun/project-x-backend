

export function formatAccountNumber(accountId: string) {
    if(accountId){

      const firstFourDigits = accountId.substring(0, 4);
      const lastTwoDigits = accountId.substring(accountId.length - 2);
      const asterisks = "*".repeat(accountId.length - 6);
      return `${firstFourDigits}${asterisks}${lastTwoDigits}`;
    }
else{
    return
}
  }