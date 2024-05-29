export class BankAccount
{
    constructor(id:number, accountAlias:string, balance?:number, availableBalance?:number )
    {
        this.id=id;
        this.balance=balance;
        this.availableBalance = availableBalance;
        this.accountAlias=accountAlias;
        
    }
    id:number;
    balance?:number;
    availableBalance?:number;
    accountAlias:string;
}