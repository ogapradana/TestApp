import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubheaderComponent } from './subheader/subheader.component';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';

const component = [
  SubheaderComponent,
  SpinnerComponent
]
const modules = [
  CommonModule,
  RouterModule,
]

@NgModule({
  declarations: [...component],
  imports: [...modules],
  exports: [...component]
})
export class SharedModule { }
