import { PagePaths } from "../Constants/constants.ts";
import Page from "./page.ts";

class LandingPage extends Page
{
    public get linkAdminPage()
    {
        return $('//a[text()="Admin Page"]');
    }

    public async open()
    {   
        
        await this.openRoute('');
        await this.waitUntilPageReady();
        
    }
}
export default new LandingPage();
