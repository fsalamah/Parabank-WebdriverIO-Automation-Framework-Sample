import Page from "./page.ts";
import { $ } from '@wdio/globals'
//a[text()="Open New Account"]
class HomePage extends Page 
{

    public get navOpenNewAccount():ChainablePromiseElement
    {
        return $('//a[text()="Open New Account"]');
    }
    public get navAccountsOverview():ChainablePromiseElement
    {
        return $('//a[text()="Accounts Overview"]');
    }
    public get navTransferFunds():ChainablePromiseElement
    {
        return $('//a[text()="Transfer Funds"]');
    }
    public get navBillPay():ChainablePromiseElement
    {
        return $('//a[text()="Bill Pay"]');
    }
    public get navFindTransactions():ChainablePromiseElement
    {
        return $('//a[text()="Find Transactions"]');
    }    
    public get navRequestLoan():ChainablePromiseElement
    {
        return $('//a[text()="Request Loan"]');
    }
    public get navLogOut():ChainablePromiseElement
    {
        return $('//a[text()="Log Out"]');
    }
    

 
}


export default new HomePage();