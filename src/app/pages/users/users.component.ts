import { Component, OnInit, HostListener } from '@angular/core';
import { INavRoute } from '@service/navigation.service';
import { UsersService } from '@resource/users.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html', 
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  // user data variable
  data : any
  page : 1
  total : any
  offset : any

  // user loader variable
  spinner = false
  loader : boolean
  
  constructor(
    private userAPI : UsersService,
    private ngxSpinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.ngxSpinner.show()
    this.fetchData(0)
  }
  
  fetchData(page:number = 0){
    this.loader = false
    this.userAPI.getUser(page, 10).then((resp: any) => {
      if(page >= 1){
        this.data = [...this.data , ...resp.data]
      } else {
        this.data = resp.data
        this.ngxSpinner.hide()
      }
      this.page = resp.page
      this.total = resp.total
      this.spinner = false
      this.loader = true
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
      this.offset = this.data.length
      if(this.offset < this.total && this.loader == true){
        this.spinner = true
        this.fetchData(this.page + 1)
      }
    }
  }
}

// define page route
export const UsersRoute: INavRoute = {
  path: 'users-list',
  component: UsersComponent,
  data: {
    breadcrumb : 'Users'
  },
};