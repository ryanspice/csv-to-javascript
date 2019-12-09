import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  dataTitles = [];
  dataSource = [];
  lastSortByColumn = null;
  lastSortByColumnInverted = false;

  sort = (column) => {

    let newDataSet;
    newDataSet = [...this.dataSource.sort(function (a, b) {
      if (column===3)
        return Number(new Date(b[column])) - Number(new Date(a[column]));
      return ('' + a[column]).localeCompare(b[column]);
    })];

    if (this.lastSortByColumn===column){
      this.lastSortByColumnInverted = !this.lastSortByColumnInverted;
    }
    this.lastSortByColumn = column;

    this.dataSource = !this.lastSortByColumnInverted?newDataSet:newDataSet.reverse();

  };

  constructor() {}

  async ngOnInit() {

    // https://www.npmjs.com/package/csv-loader
    // @ts-ignore
    let csv:any= await [...Object.values(await import( 'csv-loader!./MOCK_DATA.csv')) ];

    // remove empty end of line, not sure why we need 2
    csv.pop();
    csv.pop();

    // remove titles
    this.dataTitles = csv.shift();

    // default sort
    this.dataSource = csv.sort();
  }

}
