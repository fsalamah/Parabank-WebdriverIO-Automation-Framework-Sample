import { BankAccount } from "../types/BankAccount";
import MoneyHelper from "../utilities/MoneyHelper.ts";
import Page from "./page.ts";

/**
 * Class to handle the overview of bank accounts.
 */
class AccountsOverview extends Page{
    /**
     * Retrieves the bank account information from a table on the webpage.
     * @returns {Promise<BankAccount[]>} A promise that resolves to an array of BankAccount objects.
     */
    public async getAccounts(): Promise<BankAccount[]> {
        //await this.waitUntilPageReady();
        // Get the table rows excluding the last row (Totals) and the header row
        

        let result: BankAccount[] = [];

       //await browser.waitUntil(async ()=>await $$('//table/tbody/tr[position() < last()]/td').length>2 ,{timeout:10000,timeoutMsg:"accounts page didn't show any accounts for the user"}).catch(p=>{})
       
       
        await expect(await $$('//table/tbody/tr[position() < last()]/td')).toBeElementsArrayOfSize({gte:3,message:"Accouts overview page didn't display the customer accounts!"});
        
        let accountRows =await   $$('//table/tbody/tr[position() < last()]');
        // Iterate over each row and extract account information
        
         await   accountRows.map(async (row)=> {
            let idText = await row.$("./td[1]").getText();
            let balanceText = await row.$("./td[2]").getText();
            let availableBalanceText = await row.$("./td[3]").getText();

            // Create a BankAccount object and add it to the result array
            result.push({
                id: Number(idText),
                balance: Number(MoneyHelper.moneyStringToNumber(balanceText)),
                availableBalance: Number(MoneyHelper.moneyStringToNumber(availableBalanceText)),
                accountAlias: ""
            });
        }
    );
        return result;
    }
}

// Export an instance of AccountsOverview
export default new AccountsOverview();