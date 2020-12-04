import { Component, OnInit, HostListener } from '@angular/core';
import { INavRoute } from '@service/navigation.service';
import { paramsTree } from '@helper/route.helper';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '@resource/users.service';
import { PostService } from '@resource/post.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  // user data variable
  userID: any
  userData = []
  users = []
  address = {}

  // data user post loader variable
  spinner = false
  loader : boolean

  // data user post variable
  postData : any
  page : 1
  offset : any
  total : any

  constructor(
    private activatedRoute: ActivatedRoute,
    private userAPI: UsersService,
    private postAPI: PostService,
    private ngxSpinner: NgxSpinnerService,
  ) {
    const params = paramsTree(this.activatedRoute.snapshot);
    this.userID = params.id;
  }

  ngOnInit(): void {
    this.ngxSpinner.show()
    this.fetchUserDetail(this.userID)
    this.fetchRecomendedUser()
  }

  fetchUserDetail(id:string = '', reload:boolean = false) {
    if(reload === true){
      this.ngxSpinner.show()
      this.fetchRecomendedUser()
    }
    this.userAPI.getUserProfile(id).then((resp: any) => {
      this.userData = resp
      this.address = resp.location
      this.fetchUserPost(id, 0)
    }).catch((error) => {
      console.log(error)
    })
  }

  fetchUserPost(id:string = '', page:number = 0){
    this.loader = false
    this.postAPI.getUserPost(page, id).then((resp: any) => {
      if(page >= 1){
        this.postData = [...this.postData , ...resp.data]
      } else {
        this.postData = resp.data
      }
      this.page = resp.page
      this.total = resp.total
      this.spinner = false
      this.loader = true
    }).catch((error) => {
      console.log(error)
    })
  }

  fetchRecomendedUser() {
    const pages = Math.floor(Math.random() * 10)
    this.userAPI.getUser(pages, 5).then((resp: any) => {
      this.users = resp.data
    }).catch((error) => {
      console.log(error)
    })
  }

  // function to detect page scroll
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if(pos == max){
      this.offset = this.postData.length
      if(this.offset < this.total && this.loader == true){
        this.spinner = true
        this.fetchUserPost(this.userID, this.page + 1)
      }
    }
  }
}

// define page route
export const UserProfileRoute: INavRoute = {
  path: 'users-list/:id',
  data: {
    breadcrumb: 'Users',
    click: false
  },
  children: [
    {
      path: 'profile',
      data: {
        breadcrumb: 'Profile',
        click: false
      },
      component: UserProfileComponent,
    },
  ],
};
