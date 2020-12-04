import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageRoute } from './pages.component';

const routes: Routes = [PageRoute];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
