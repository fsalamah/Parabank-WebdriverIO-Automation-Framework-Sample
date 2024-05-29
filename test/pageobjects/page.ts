import { browser } from '@wdio/globals'
import { config } from '../../wdio.conf.ts'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
     protected openRoute (path: string) {
         return browser.url(`${config.baseUrl}/${path}`)
     }
    
    public async waitUntilPageReady()
    {
        return browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            {
              timeout: config.waitforTimeout ,
              timeoutMsg: 'Page took too long to be ready'
            }
          );
    }
}
