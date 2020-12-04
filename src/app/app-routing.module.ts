import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { INavRoutes } from '@service/navigation.service';
import { PageRoute } from '@pages/pages.component';

const routes: INavRoutes = [PageRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
