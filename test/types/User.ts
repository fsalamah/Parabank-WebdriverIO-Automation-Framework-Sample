import { BankAccount } from "./BankAccount"

export class User
{
    constructor(username:string, password:string, accounts:BankAccount[])
    {
        this.username = username;
        this.password=password;
        this.accounts = accounts;        
    }
    
    username:string;
    password:string;
    accounts:BankAccount[];
}