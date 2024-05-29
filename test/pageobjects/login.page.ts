import  allureReporter  from '@wdio/allure-reporter';
import { $ } from '@wdio/globals'
import Page from './page.ts';
import { PagePaths } from '../Constants/constants.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return $('[name="username"]');
    }

    public get inputPassword () {
        return $('[name="password"]');
    }

    public get btnSubmit () {
        return $('input[value="Log In"]');
    }
    public get textLoginError()
    {
        return $('[class="error"]');
    }
    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        allureReporter.startStep(`Login with username ${username} and password ${password}`);
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
        allureReporter.endStep();
    }


    public async open () {        
         await this.openRoute(PagePaths.login);
          await expect(this.btnSubmit).toBeDisplayed({message:'Login page is not displayed correctly'})

          
                
    }
}

export default new LoginPage();
