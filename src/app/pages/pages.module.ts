import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { LayoutModule } from '@layout/layout.module';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfileComponent } from './user-profile/profile/profile.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';


@NgModule({
  declarations: [
    PagesComponent,
    UsersComponent,
    DashboardComponent,
    UserProfileComponent,
    ProfileComponent,
    PostDetailComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    PagesRoutingModule,
    SharedModule,
    NgxSpinnerModule,
    CrystalLightboxModule
  ]
})
export class PagesModule { }
