import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material'
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    MatTableModule,
    MatButtonModule,
    ScrollDispatchModule,
    BrowserModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
