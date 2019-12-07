import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material'
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    MatTableModule,
    ScrollDispatchModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
