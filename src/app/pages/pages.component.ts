import { Component } from '@angular/core';
import { INavRoute } from '@service/navigation.service';
import { DashboardRoute } from '@pages/dashboard/dashboard.component';
import { UsersRoute } from '@pages/users/users.component';
import { UserProfileRoute } from '@pages/user-profile/user-profile.component';
import { PostDetailRoute } from '@pages/post-detail/post-detail.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
})
export class PagesComponent {}

// define main route
export const PageRoute: INavRoute = {
  path: '',
  component: PagesComponent,
  data: {
    breadcrumb : 'Test App'
  },
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'dashboard',
    },
    DashboardRoute,
    UsersRoute,
    UserProfileRoute,
    PostDetailRoute
  ],
};
