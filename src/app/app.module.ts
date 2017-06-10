import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DatepickerModule, SimpleDatepickerModule }	from 'ng-imbadatepicker';

import { AppComponent } from './app.component';
import { SelectDatepicker } from './components/select.datepicker';

/*
import { CustomDatePicker } from './customdatepicker';

import { CorrectorsModule } from 'ng2-correctors';
import { GroupInputModule } from 'ng2-groupinput';

import { DropDownSelect } from './dropdown';
*/

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,

    DatepickerModule,
    SimpleDatepickerModule,

    /*
    CorrectorsModule,
    GroupInputModule,
    */
  ],
  declarations: [
    AppComponent,

    SelectDatepicker

    /*
    DropDownSelect,

    CustomDatePicker
    */
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


