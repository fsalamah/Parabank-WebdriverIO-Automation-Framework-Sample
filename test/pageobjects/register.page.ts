
import { PagePaths } from "../Constants/constants.ts";
import Page from "./page.ts";
import {faker } from '@faker-js/faker'
class RegisterPage extends Page
{
    public get firstNameText () {
        return $("[name='customer.firstName']");
    }
    public get lastNameText () {
        return $("[name='customer.lastName']");
    }
    public get addressText () {
        return $("[name='customer.address.street']");
    }
    public get cityText () {
        return $("[name='customer.address.city']");
    }   
    public get stateText () {
        return $("[name='customer.address.state']");
    }
    public get zipText () {
        return $("[name='customer.address.zipCode']");        
    }
    public get phoneText () {
        return $("[name='customer.phoneNumber']");
    }
    public get ssnText () {    
        return $("[name='customer.ssn']");
    }

    public get usernameText () {
        return $("[name='customer.username']");
    }
    public get passwordText () {
        return $("[name='customer.password']");
    }
    public get repeatPasswordText () {
        return $("[name='repeatedPassword']");
        
    }
    
    public get registerButton()
    {
        return $('[value="Register"]')
    }

    public open():Promise<string>
    {        
       return super.openRoute(PagePaths.register);
    }
    public  registerUser(username:string, password:string, repeatPassword:string):Promise<void>
    { 
        return Promise.all([
        this.firstNameText.setValue(faker.person.firstName()),
        this.lastNameText.setValue(faker.person.lastName()),
        this.addressText.setValue(faker.location.street()),
        this.stateText.setValue(faker.location.state()),
        this.cityText.setValue(faker.location.city()),
        this.zipText.setValue(faker.number.int({min:1000, max:10000})),
        this.phoneText.setValue(faker.number.int({min:100000, max:10000000})),
        this.ssnText.setValue(faker.number.int({min:100000, max:10000000})),
        this.usernameText.setValue(username),
        this.passwordText.setValue(password),
        this.repeatPasswordText.setValue(repeatPassword)]).then(()=>this.registerButton.click());

    }
    
}

export default new RegisterPage();
