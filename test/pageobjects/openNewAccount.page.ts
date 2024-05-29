import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class OpenNewAccountPage extends Page {
    
    public get selectAccountType () {
        return $('select[id="type"]');
    }

    public get selectFundingAccount () {
        return $('select[id="fromAccountId"]');
    }
    
    public get buttonOpenNewAccount()
    {
        return $('input[value="Open New Account"]');

    }
    public get newAccountId()
    {
        return $('a[id="newAccountId"]')
    }
    public get textAccountOpenedTitle()
    {
        return $('#openAccountResult h1')
    }
    public async openNewAccount (sourceAccountId:number,accountType: string){
        
        await expect(this.selectFundingAccount).toHaveChildren({gte:1})
        await (await this.selectAccountType).selectByVisibleText(accountType);
        await (await this.selectFundingAccount).selectByVisibleText(sourceAccountId);
        await (await  this.buttonOpenNewAccount).click();
        
       
    }

}

export default new OpenNewAccountPage();
