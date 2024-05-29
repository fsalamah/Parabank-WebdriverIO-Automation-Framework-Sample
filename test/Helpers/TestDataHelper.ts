import AllureReporter from "@wdio/allure-reporter";
import HomePage from "../pageobjects/home.page.ts";
import LoginPage from "../pageobjects/login.page.ts";
import { BankAccountTestData, UserTestData } from "../types/TestDataRecordTypes.ts";
import { User } from "../types/User.ts";
import openNewAccountPage from "../pageobjects/openNewAccount.page.ts";
import { BankAccount } from "../types/BankAccount.ts";
import FrameworkException from "../FrameworkException.ts";
import RegisterPage from "../pageobjects/register.page.ts";
import AccountsOverviewPage from "../pageobjects/AccountsOverview.page.ts";
import adminPage from "../pageobjects/admin.page.ts";
import csvReaderUtility from "../utilities/csvReaderUtility.ts";
import { TestDataFiles } from "../Constants/constants.ts";
import LandingPage from "../pageobjects/landing.page.ts";
import { config } from "../../wdio.conf.ts";

export let users: User[] = [];

export async function Login(username: string, password: string): Promise<void> {
  await LoginPage.open();
  await LoginPage.login(username, password);
  //Ensure login success since this method is only expected to login for other test scenarios
  await expect(HomePage.navLogOut).toBeDisplayed({ message: `Could not login with ${username},${password}` });

}


/**
 * Creates bank accounts for a given user based on test data. The user must be logged-in already.
 *
 * @param {string} username - The username of the user for whom to create accounts.
 * @param {BankAccount[]} userAccounts - An array containing existing user bank accounts (potentially empty).
 * @param {BankAccountTestData[]} accountsTestData - An array of test data defining the accounts to create.
 * @returns {Promise<BankAccount[]>} A promise that resolves to an array containing all user bank accounts (including newly created ones).
 */
async function CreateUserBankAccounts(username: string, userAccounts: BankAccount[], accountsTestData: BankAccountTestData[]): Promise<BankAccount[]> {

  AllureReporter.startStep(`Create user ${username} bank accounts`);

  // Loop through test data matching the username
  for (const account of accountsTestData.filter((p: any) => p.username === username)) {
    AllureReporter.startStep(`Creating account ${account.account_alias} (${account.account_type}) from account ${account.created_from}`);

    // Open a new account using the specified details
    await HomePage.navOpenNewAccount.click();
    const sourceAccount = userAccounts.find(p => p.accountAlias === account.created_from);
    if (!sourceAccount)
      throw new FrameworkException("Source account was not found in the user bank accounts array!")
    await openNewAccountPage.openNewAccount(sourceAccount.id, account.account_type);

    // Verify successful account creation
    await expect(openNewAccountPage.textAccountOpenedTitle).toHaveText("Account Opened!");

    // Extract the new account ID and create a BankAccount object
    const accountId = Number(await openNewAccountPage.newAccountId.getText());
    userAccounts.push(new BankAccount(accountId, account.account_alias));

    AllureReporter.endStep();
  }

  AllureReporter.endStep();

  // Return the updated userAccounts array with newly created accounts
  return userAccounts;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function SetupTestEnvironment() {
  try {

    await browser.navigateTo(config.baseUrl!);
    
    
    await adminPage.open();      
    await browser.refresh();
    await browser.saveScreen('././allure-results/before_start.png');
    await adminPage.cleanAndInitialize(1000, 10000);
    let usersTestData = csvReaderUtility.loadTestData(TestDataFiles.PrerequisiteTestData.usersTestData);
    let accountsTestData = csvReaderUtility.loadTestData(TestDataFiles.PrerequisiteTestData.accountsTestData);
    users = await CreatePrerequisiteTestData(usersTestData, accountsTestData);
    
  }
  catch (error) {
    
    console.error('Aborting test! error in test setup:', error);
    throw error;
  }
}
async function CreatePrerequisiteTestData(usersTestData: UserTestData[], accountsTestData: BankAccountTestData[]): Promise<User[]> {

  let result: User[] = [];
  for (let user of usersTestData!) {

    let newUser
    let userAccounts

    AllureReporter.startStep(`Create user ${user.username} prerequisite test data`);
    AllureReporter.startStep(`Register User  ${user.username}`);
    await RegisterPage.open();
    await RegisterPage.registerUser(user.username, user.password, user.password);
    AllureReporter.endStep();


    AllureReporter.addStep(`Identify user ${user.username} default (initial) bank account account id and initialize`);
    await HomePage.navAccountsOverview.click();
    //identify the initial (Default) account and give it the alias default
    userAccounts = await AccountsOverviewPage.getAccounts();
    userAccounts[0].accountAlias = "default";
    newUser = new User(user.username, user.password, userAccounts!);
    AllureReporter.endStep();

    newUser.accounts = await CreateUserBankAccounts(newUser.username, newUser.accounts, accountsTestData);
    result.push(newUser);

    await HomePage.navLogOut.click();
    AllureReporter.endStep();

  }

  return result;
}