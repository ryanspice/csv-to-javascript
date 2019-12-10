import { Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';

/**
 * basic table component, rendering a virtual list based on a set of data
 */

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  // TODO: extend options with env command line arguments

  options = {
    eof:true,
    titles:true,
    sort:true
  }

  order:Array<number> = [
    0,
    1,
    2,
    3
  ];

  dataTitles:Array<any> = [];
  dataSource:Array<any> = [];
  dataStore:Array<any> = [];

  lastSortByColumn = null;
  lastSortByColumnInverted:boolean = false;
  inIframe = ()=>{
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  constructor() {

    //Remove header inside iframe
    if (!this.inIframe()) {
      document.getElementById('header').removeAttribute('hidden');
    } else {
      document.getElementById('header').setAttribute('hidden','hidden');
    }

  }


  /**
   * resets data values to null
   */

  reset(){

    this.order = [
      0,1,2,3
    ];
    this.dataTitles = [];
    this.dataSource = [];
    this.lastSortByColumn = null;
    this.lastSortByColumnInverted = false;

  }

  /**
   *  initialize table with data
   * @param data
   */

  async init(data:Array<any>){

    // @ts-ignore
    const csv = await [...Object.values(data) ];


    // @ts-ignore
    this.dataTitles = this.options.titles?csv.shift():['','','','','','']; // remove titles
    this.dataSource = this.dataStore = csv;

    if (this.options.eof){
      this.dataSource.pop();
    }

    if (this.options.sort)
      this.sort(this.order[0]);

  }

  /**
   * handle sorting, returns new list to dataSource, trys sorting by date if possible
   * @param column
   * @param filter
   */
  lastFilter = '';
  sort = (column:number, filter=null) => {

    this.dataSource = this.dataStore;

    let newDataSet;
    newDataSet = [...this.dataSource.sort(function (a, b) {
      if (column==3 || (!isNaN(Date.parse(a))))
        return Number(new Date(b[column])) - Number(new Date(a[column]));
      return ('' + a[column]).localeCompare(b[column]);
    })];

    if (this.lastSortByColumn===column){
      this.lastSortByColumnInverted = !this.lastSortByColumnInverted;
    }

    this.lastSortByColumn = column;
    newDataSet = !this.lastSortByColumnInverted?newDataSet:newDataSet.reverse();

    if(filter)
       this.dataSource =  newDataSet.filter((a)=>{return a.indexOf(filter)>-1});
    else
      this.dataSource = newDataSet;

    this.lastFilter = filter;
  };

}
