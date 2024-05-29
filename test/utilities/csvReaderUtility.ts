
import * as fs from 'node:fs'
import { parse } from 'csv-parse/sync'



class CsvReaderUtility {

  public readCSV(path: string) {
    return parse(fs.readFileSync(path), {
      columns: true,
      skip_empty_lines: true
    })
  }

  public loadTestData(path: string)
  {
      const dataRows = this.readCSV(path);
      const result = dataRows.filter((r:any)=>r.isActive ==='1');
      return result;

     
  }

}

export default new CsvReaderUtility();
