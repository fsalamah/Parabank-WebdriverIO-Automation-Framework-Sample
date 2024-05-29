
import * as fs from 'node:fs'
import { parse } from 'csv-parse/sync'
import { BaseTestData } from '../types/Interfaces.ts';



class CsvReaderUtility {

  public readCSV<T >(path: string):T[] {
    return parse(fs.readFileSync(path), {
      columns: true,
      skip_empty_lines: true
    })
  }

  public loadTestData<T extends BaseTestData>(path: string):T[]
  {
      const dataRows = this.readCSV<T>(path);
      
      const result = dataRows.filter((r)=>r.isActive.toUpperCase() ==='TRUE');
      console.log(result)
      return result as T[];

     
  }

}

export default new CsvReaderUtility();