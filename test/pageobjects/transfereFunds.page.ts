

import { $ } from '@wdio/globals'
import Page from './page.js';
import AllureReporter from '@wdio/allure-reporter';
import {  Status as AllureStatus } from 'allure-js-commons';
/**
 * sub page containing specific selectors and methods for a specific page
 */
class TransferFundsPage extends Page {
    
    public get inputTransferAmount () {
        return $('input[id="amount"]');
    }

    public get selectFromAccount () {
        return $('select[id="fromAccountId"]');
    }

    public get selectToAccount () {
        return $('select[id="toAccountId"]');
    }
    public get buttonTransfer()
    {
        return $('input[value="Transfer"]');
    }
    public  get  textTransferCompleteTitle()
    {
        return $('div#showResult h1');
    }
    public get textTransferCompletDescription()
    {
        return $('//div[@id="showResult"]/p[1]');
    }
    public get textTransactionError()
    {
        return $('//p[@class="error"]');
    }
    
    public async transferFunds (fromAccountId:number,toAccountId:number, amount:number) {
        AllureReporter.startStep(`Executin transfere form account id ${fromAccountId} to account id ${toAccountId} amount ${amount}`)
            try
            {
                await Promise.all([
                 this.inputTransferAmount.setValue( amount),
                 this.selectFromAccount.selectByVisibleText(fromAccountId),
                 this.selectToAccount.selectByVisibleText(toAccountId)  ]);
                
                 await this.buttonTransfer.click()
                
        }
       catch (error: any) {
            AllureReporter.endStep(AllureStatus.FAILED);
            await expect(false).toBeTruthy( );
          }
          AllureReporter.endStep(AllureStatus.PASSED);
            
    }


    
}

export default new TransferFundsPage();
export const TransferFundsPageConstants={TRANSFER_COMPLETE_TEXT:'Transfer Complete!'}