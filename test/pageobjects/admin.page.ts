import { $ } from '@wdio/globals'
import Page from './page.ts';
import { PagePaths } from '../Constants/constants.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AdminPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputInitialBalance () {
        return $('input[id="initialBalance"]');
    }
    public get inputMinBalance()
    {
        return $('input[id="minimumBalance"]');
    }
    public get buttonInitialize()
    {
        return $('button[value="INIT"]');
    }
    public get buttonClean()
    {
        return $('button[value="CLEAN"]');
    }
    public get buttonSubmit()
    {
        return $('input[value="Submit"]');
    }

    
    

    public async cleanAndInitialize (minBalance:number,initialBalance:number) {
        await this.buttonClean.click();
        await this.buttonInitialize.click();
        await this.inputMinBalance.setValue( minBalance);
        await this.inputInitialBalance.setValue(initialBalance);
        await this.buttonSubmit.click();
    }

    
    public  open () {
        
        return super.openRoute(PagePaths.admin);

    }
}

export default new AdminPage();
