// Import necessary modules and dependencies
// Importing user data
import { expect } from '@wdio/globals'; // Importing assertion library
import LoginPage from '../pageobjects/login.page.ts'; // Importing LoginPage object
import CsvReaderUtility from '../utilities/csvReaderUtility.ts'; // Importing CSV reader utility
import { TestDataFiles } from '../Constants/constants.ts'; // Importing test data file constants
import HomePage from '../pageobjects/home.page.ts'; // Importing HomePage object
import AccountsOverviewPage from '../pageobjects/AccountsOverview.page.ts'; // Importing AccountsOverviewPage object
import TransfereFundsPage, { TransferFundsPageConstants } from '../pageobjects/transfereFunds.page.ts'; // Importing transfereFundsPage object and constants
import AllureReporter from '@wdio/allure-reporter'; // Importing AllureReporter for reporting
import { TransferNegativeTestCase, TransferPositiveTestCase } from '../types/Interfaces.ts'; // Importing TransferTestData type
import { BankAccount } from '../types/BankAccount.ts'; // Importing BankAccount type
import { findOrThrow } from '../utilities/ArrayExtensions.ts'; // Importing array utility function
import { usersPrerequisiteData  } from '../Helpers/TestDataHelper.ts';//User prerequisite test data found here

// Load transfer test data from CSV file
const transferPositiveTestCases: TransferPositiveTestCase[] = CsvReaderUtility.loadTestData<TransferPositiveTestCase>(TestDataFiles.transferTestCases.transferPositiveTestCases);
const transferNegativeTestCases: TransferNegativeTestCase[] = CsvReaderUtility.loadTestData<TransferNegativeTestCase>(TestDataFiles.transferTestCases.transferNegativeTestCases);

// Define test suite for transfer positive tests
describe('Transfer tests', () => {

    // Hook to be executed after each test
    afterEach(async () => {
        try {
            await HomePage.navLogOut.click(); // Logout after each test
        } catch (error) {
            console.error('Error in afterEach:', error); // Log any errors during logout
        }
    });

    // Iterate over each transfer test case
    transferPositiveTestCases.forEach((positiveTestCase) => {

        it(`${positiveTestCase.description} should be processed successfully`, async () => {
            // Find user for the current test case
            const user = findOrThrow(usersPrerequisiteData, p => p.username === positiveTestCase.username);

            // Login with user and perform transfer steps
            await AllureReporter.step(`Login with user (${user.username})`, async () => {
                await LoginPage.open(); // Open login page
                await LoginPage.login(user.username, user.password); // Login with user credentials
                await expect(HomePage.navLogOut).toBeDisplayed(); // Verify successful login
            });

            // Initialize variables to capture account details before transfer
            let accountsBeforeTransfer:     BankAccount[];
            let fromAccountBeforeTransfer:  BankAccount;
            let toAccountBeforeTransfer:    BankAccount;
            let fromAccountId:  number;
            let toAccountId:    number;

            // Capture account details before the transfer
            await AllureReporter.step(`Capture the amounts from the from-account (${positiveTestCase.from_account_alias}) and 
                                        the to-account (${positiveTestCase.to_account_alias}) before the transfer`, async () => {
                await HomePage.navTransferFunds.click(); // Navigate to transfer funds page
                fromAccountId   = findOrThrow(user.accounts, p => p.accountAlias === positiveTestCase.from_account_alias).id; // Find from account ID
                toAccountId     = findOrThrow(user.accounts, p => p.accountAlias === positiveTestCase.to_account_alias).id; // Find to account ID

                // Navigate to accounts overview page
                await HomePage.navAccountsOverview.click();
                // Get current account details
                accountsBeforeTransfer      = await AccountsOverviewPage.getAccounts();
                fromAccountBeforeTransfer   = findOrThrow(accountsBeforeTransfer, p => p.id === fromAccountId); // Find from account details
                toAccountBeforeTransfer     = findOrThrow(accountsBeforeTransfer, p => p.id === toAccountId); // Find to account details
            });

            // Execute the transfer and verify success
            await AllureReporter.step(`Execute the transfer from account ${positiveTestCase.from_account_alias} (Id:${fromAccountId}) 
                                        to account ${positiveTestCase.to_account_alias} (Id:${toAccountId}) with the amount ${positiveTestCase.transfer_amount}`, async () => {
                await HomePage.navTransferFunds.click(); // Navigate to transfer funds page
                await TransfereFundsPage.transferFunds(fromAccountId, toAccountId, positiveTestCase.transfer_amount); // Perform transfer              
            });

            // Verify the transfer success message
            await AllureReporter.step('Verify the transfer success message', async () => {
                await expect(TransfereFundsPage.textTransferCompleteTitle).toHaveText(TransferFundsPageConstants.TRANSFER_COMPLETE_TEXT); // Verify transfer complete message
                await expect(TransfereFundsPage.textTransferCompletDescription).toHaveText(`$${positiveTestCase.expect_transfer_amount} has been transferred from account #${fromAccountId} to account #${toAccountId}.`);
            });

            // Verify that the amounts are updated after the transfer
            let accountsAfterTransfer:      BankAccount[];
            let fromAccountAfterTransfer:   BankAccount;
            let toAccountAfterTransfer:     BankAccount;
            await AllureReporter.step('Verify that the amounts are updated after the transfer is done', async () => {
                await HomePage.navAccountsOverview.click(); // Navigate to accounts overview page
                accountsAfterTransfer = await AccountsOverviewPage.getAccounts(); // Get updated account details
                fromAccountAfterTransfer = findOrThrow(accountsAfterTransfer, p => p.id === fromAccountId); // Find updated from account details
                toAccountAfterTransfer = findOrThrow(accountsAfterTransfer, p => p.id === toAccountId); // Find updated to account details

                // Verify balances

            });

            await AllureReporter.step(`Verify Balances. (from-account Before Balance: ${fromAccountBeforeTransfer.balance} after balance ${fromAccountAfterTransfer.balance})
                                (to-account Before Balance: ${toAccountBeforeTransfer.balance} After balance: ${toAccountAfterTransfer.balance})`,
                async () => {
                    await expect(fromAccountAfterTransfer.balance).toEqual(fromAccountBeforeTransfer.balance - positiveTestCase.transfer_amount); // Verify from account balance
                    await expect(toAccountAfterTransfer.balance).toEqual(toAccountBeforeTransfer.balance + parseFloat(positiveTestCase.expect_transfer_amount)); // Verify to account balance
                });
        });

    });








    transferNegativeTestCases.forEach((negativeTestCase) => {

        it(`${negativeTestCase.description} should display ${negativeTestCase.expect_error_message}`, async () => {
            // Find user for the current test case
            const user = findOrThrow(usersPrerequisiteData, p => p.username === negativeTestCase.username);

            // Login with user and perform transfer steps
            await AllureReporter.step(`Login with user (${user.username})`, async () => {
                await LoginPage.open(); // Open login page
                await LoginPage.login(user.username, user.password); // Login with user credentials
                await expect(HomePage.navLogOut).toBeDisplayed(); // Verify successful login
            });

            // Initialize variables to capture account details before transfer
            let accountsBeforeTransfer: BankAccount[];
            let fromAccountBeforeTransfer: BankAccount;
            let toAccountBeforeTransfer: BankAccount;
            let fromAccountId: number;
            let toAccountId: number;

            // Capture account details before the transfer
            await AllureReporter.step(`Capture the amounts from the from-account (${negativeTestCase.from_account_alias}) and 
                                        the to-account (${negativeTestCase.to_account_alias}) before the transfer`, async () => {
                await HomePage.navTransferFunds.click(); // Navigate to transfer funds page
                fromAccountId = findOrThrow(user.accounts, p => p.accountAlias === negativeTestCase.from_account_alias).id; // Find from account ID
                toAccountId = findOrThrow(user.accounts, p => p.accountAlias === negativeTestCase.to_account_alias).id; // Find to account ID

                // Navigate to accounts overview page
                await HomePage.navAccountsOverview.click();
                // Get current account details
                accountsBeforeTransfer = await AccountsOverviewPage.getAccounts();
                fromAccountBeforeTransfer = findOrThrow(accountsBeforeTransfer, p => p.id === fromAccountId); // Find from account details
                toAccountBeforeTransfer = findOrThrow(accountsBeforeTransfer, p => p.id === toAccountId); // Find to account details
            });

            // Execute the transfer and verify success
            await AllureReporter.step(`Execute the transfer from account ${negativeTestCase.from_account_alias} (Id:${fromAccountId}) 
                                        to account ${negativeTestCase.to_account_alias} (Id:${toAccountId}) with the amount ${negativeTestCase.transfer_amount}`, async () => {
                await HomePage.navTransferFunds.click(); // Navigate to transfer funds page
                await TransfereFundsPage.transferFunds(fromAccountId, toAccountId, negativeTestCase.transfer_amount); // Perform transfer

            });

            // Verify the transfer success message
            await AllureReporter.step(`Verify the transfer error message is displayed (${negativeTestCase.expect_error_message})`, async () => {
                await expect(TransfereFundsPage.textTransactionError).toHaveText(negativeTestCase.expect_error_message);
            });
            
            //Verify that the amounts are NOT updated after the transfer attempt
            let accountsAfterTransfer: BankAccount[];
            let fromAccountAfterTransfer: BankAccount;
            let toAccountAfterTransfer: BankAccount;            
            await AllureReporter.step('Verify that the amounts are NOT updated after the transfer is done', async () => {
                await HomePage.navAccountsOverview.click(); // Navigate to accounts overview page
                const accountsAfterTransfer     = await AccountsOverviewPage.getAccounts(); // Get updated account details
                const fromAccountAfterTransfer  = findOrThrow(accountsAfterTransfer, p => p.id === fromAccountId); // Find updated from account details
                const toAccountAfterTransfer    = findOrThrow(accountsAfterTransfer, p => p.id === toAccountId); // Find updated to account details
            });

            //Verify balances
            await AllureReporter.step(`Verify Balances. (from-account Before Balance: ${fromAccountBeforeTransfer.balance} after balance ${fromAccountAfterTransfer.balance})
             (to-account Before Balance: ${toAccountBeforeTransfer.balance} After balance: ${toAccountAfterTransfer.balance})`,
                async () => {
                    await expect(fromAccountAfterTransfer.balance).toEqual(fromAccountBeforeTransfer.balance); // Verify from account balance
                    await expect(toAccountAfterTransfer.balance).toEqual(toAccountBeforeTransfer.balance); // Verify to account balance
                });
        });

    });




});