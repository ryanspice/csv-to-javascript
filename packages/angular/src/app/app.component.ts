import { ViewChild, ViewChildren, Component } from '@angular/core';
import csvLoader from "csv-loader";

/**
 * parsing options: see readme.md
 */

enum PARSER {
  DEFAULT = 0,
  PAPA = 1,
  LOADER = 2,
  CUSTOM = 3
}

/**
 *  simple caching system
 */

const _MOCK_DATA_ = new Map();
const _MOCK_DATA_CURRENT_ = '';
const _MOCK_DATA_CSV_ = "./assets/MOCK_DATA.csv";
const _MOCK_DATA_CSV_CANADA_TRAINS_ = "./assets/MOCK_DATA_CANADA_TRAINS.csv";

/**
 * entry point,
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  parser:PARSER = PARSER.LOADER;

  title:string = 'csv-to-javascript';
  test:string;

  disabled:boolean = false;

  @ViewChild('table', {static: false}) table;
  @ViewChild('file', {static: false}) file;
  @ViewChild('mockData', {static: false}) mockData;
  @ViewChild('mockTrains', {static: false}) mockTrains;
  @ViewChildren('options_parser') options;

  /**
   * toggle 'disabled' on elements
   */

  toggleEnabled(){
    this.disabled = !this.disabled;
    if (!this.disabled){
      this.mockData.nativeElement.removeAttribute('disabled');
      this.mockTrains.nativeElement.removeAttribute('disabled');
      this.file.nativeElement.removeAttribute('disabled');
      this.options.forEach(e=>e.nativeElement.removeAttribute('disabled'));
    } else {
      this.mockData.nativeElement.setAttribute('disabled','disabled');
      this.mockTrains.nativeElement.setAttribute('disabled','disabled');
      this.file.nativeElement.setAttribute('disabled','disabled');
      this.options.forEach(e=>e.nativeElement.setAttribute('disabled','disabled'));
    }
  }

  /**
   * reset file value, reset table
   */

  resetData = () => {
    this.file.nativeElement.value = "";
    this.table.reset();
  };

  /**
   * load data based on input
   * @param files
   */

  loadUserData = async (files: Response | FileList | Array<File> | string) => {

    let text:string;

    this.toggleEnabled();

    if ((_MOCK_DATA_.get(_MOCK_DATA_CURRENT_)) ){
      text = _MOCK_DATA_.get(_MOCK_DATA_CURRENT_);
    } else {

      // @ts-ignore
      const file = files.length?files.item(0):files;
      text = await file.text();
      _MOCK_DATA_.set(`${_MOCK_DATA_CURRENT_}`,_MOCK_DATA_CURRENT_)
    }

    const data = await this.loadParserOption(text);

    await this.table.init(data);
    this.toggleEnabled();

  };


  /**
   * load _MOCK_DATA_CSV_
   */

  loadMockData = async (event:Event) => {
    console.log(this.table);
    await this.resetData();
    _MOCK_DATA_.set(`${_MOCK_DATA_CSV_}`,_MOCK_DATA_CSV_);
    await this.loadUserData(await fetch(_MOCK_DATA_CSV_));
  };

  /**
   * load _MOCK_DATA_CSV_CANADA_TRAINS_
   */

  loadMockTrainData = async (event:Event) => {
    await this.resetData();
    this.table.order = await [
      4,5,12,0
    ];
    _MOCK_DATA_.set(`${_MOCK_DATA_CSV_CANADA_TRAINS_}`,_MOCK_DATA_CSV_CANADA_TRAINS_);
    await this.loadUserData(await fetch(_MOCK_DATA_CSV_CANADA_TRAINS_));

  };

  /**
   * load parser and paser options
   */

  loadParser = (event:Event) => {
    event.stopPropagation();
    if (this.disabled){
      return;
    }
    // @ts-ignore
    const value = event.target.getAttribute('value');
    this.options._results[value].nativeElement.checked = true;
    this.parser = PARSER[PARSER[value]];
    this.resetData();
  }

  /**
   * load a specific parsing option
   * @param text
   */

  loadParserOption = async (text) => {
    let csvArray;
    let time = new Date().getTime();
    let parsingTime = 0;
    switch(this.parser){
      case PARSER.DEFAULT:

        console.log('Opening vanilla...');
        const CSVToArray = (await import("../../../csv-to-javascript/csvToArray")).default;
        parsingTime = await new Date().getTime();
        console.log('Parsing w/vanilla...',parsingTime-time+"ms");
        csvArray = await CSVToArray( text || '', ',' );
        console.log('Finished Parsing w/vanilla...', (new Date().getTime()-parsingTime) + "ms");
        break;
      case PARSER.PAPA:

        console.log('Opening papa...');
        const CSVToPapa = (await import("../../../csv-to-javascript/csvToPapaParse")).default;
        parsingTime = await new Date().getTime();
        console.log('Parsing w/papa...',parsingTime-time+"ms");
        csvArray = await CSVToPapa( text || '', ',' );
        console.log('Finished Parsing w/papa...', (new Date().getTime()-parsingTime) + "ms");
        break;
      case PARSER.LOADER:

        console.log('Opening loader...');
        const CSVLoader =(await import("csv-loader")).default;
        parsingTime = await new Date().getTime();
        console.log('Parsing w/loader...',parsingTime-time+"ms");
        csvArray = await eval(await csvLoader(text));
        console.log('Finished Parsing w/loader...', (new Date().getTime()-parsingTime) + "ms");
        break;
      case PARSER.CUSTOM:
        //possible 4th option
        break;
    }
    return csvArray;
  }

}
