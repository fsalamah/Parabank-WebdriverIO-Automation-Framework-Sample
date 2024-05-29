

import { $ } from '@wdio/globals'
import Page from './page.ts';
import AllureReporter from '@wdio/allure-reporter';
import { Status as AllureStatus } from 'allure-js-commons';
/**
 * sub page containing specific selectors and methods for a specific page
 */
class TransferFundsPage extends Page {

   /** Input field for entering transfer amount. */
   public get inputTransferAmount() {
    return $('input[id="amount"]');
}

/** Dropdown for selecting the account from which funds will be transferred. */
public get selectFromAccount() {
    return $('select[id="fromAccountId"]');
}

/** Dropdown for selecting the account to which funds will be transferred. */
public get selectToAccount() {
    return $('select[id="toAccountId"]');
}

/** Button to initiate the transfer process. */
public get buttonTransfer() {
    return $('input[value="Transfer"]');
}

/** Title element displaying transfer completion message. */
public get textTransferCompleteTitle() {
    return $('div#showResult h1');
}

/** Description element displaying transfer completion details. */
public get textTransferCompletDescription() {
    return $('//div[@id="showResult"]/p[1]');
}

/** Element displaying transaction error message, if any. */
public get textTransactionError() {
    return $('//p[@class="error"]');
}

/**
 * Initiates transfer of funds between accounts.
 * @param fromAccountId - ID of the account from which funds will be transferred.
 * @param toAccountId - ID of the account to which funds will be transferred.
 * @param amount - Amount of funds to transfer.
 */
public async transferFunds(fromAccountId: number, toAccountId: number, amount: number): Promise<void> {
    AllureReporter.startStep(`Executing transfer from account id ${fromAccountId} to account id ${toAccountId} amount ${amount}`);
    try {
        await Promise.all([
            this.inputTransferAmount.setValue(amount),
            this.selectFromAccount.selectByVisibleText(fromAccountId),
            this.selectToAccount.selectByVisibleText(toAccountId),
    
        ]);
        await this.buttonTransfer.click();
    } catch (error) {
        await expect('').toContain(!"An exception has happened: \n"+JSON.stringify(error));
        
        AllureReporter.endStep(AllureStatus.FAILED);
        
    }
    AllureReporter.endStep(AllureStatus.PASSED);
    return;
}



}

export default new TransferFundsPage();
export const TransferFundsPageConstants = { TRANSFER_COMPLETE_TEXT: 'Transfer Complete!' }