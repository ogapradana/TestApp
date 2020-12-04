import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';

const component = [
  ToolbarComponent,
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
export class LayoutModule { }
