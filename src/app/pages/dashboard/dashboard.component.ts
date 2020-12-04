import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { PostService } from '@resource/post.service';
import { INavRoute } from '@service/navigation.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // post loader variable
  postSpinner = false
  postLoader : boolean

  // tag loader variable
  tagsSpinner = false
  tagsLoader : boolean

  // post data variable
  postData : any
  postPage : number
  postOffset : any
  postTotal : any

  // tag data variable
  tagsData : any
  tagsPage : number
  tagsOffset : any
  tagsTotal : any

  selectedTag = 'Tags'

  constructor(
    private postAPI: PostService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show()
    this.fetchData(0)
  }

  fetchData(page:number = 0, tag:string = 'Tags'){
    this.postLoader = false
    var params = {}
    if(tag != 'Tags'){
      params = {
        page : page,
        tag : tag
      }
    } else {
      params = {
        page : page 
      }
    }
    this.postAPI.getAllPost(params).then((resp: any) => {
      if(page >= 1){
        this.postData = [...this.postData , ...resp.data]
      } else {
        this.postData = resp.data
        this.fetchTag(0)
      }
      this.postPage = resp.page
      this.postTotal = resp.total
      this.postSpinner = false
      this.postLoader = true
    }).catch((error) => {
      console.log(error)
    })
  }

  fetchTag(page:number = 0){
    this.tagsLoader = false
    this.postAPI.getTags(page).then((resp: any) => {
      if(page >= 1){
        this.tagsData = [...this.tagsData , ...resp.data]
      } else {
        this.tagsData = resp.data
      }
      this.tagsPage = resp.page
      this.tagsTotal = resp.total
      this.tagsSpinner = false
      this.tagsLoader = true
    }).catch((error) => {
      console.log(error)
    })
  }

  // apply tag filter
  filterTag(tag:string = ''){
    this.spinner.show()
    this.selectedTag = tag
    this.fetchData(0, tag)
  }

  // remove tag filter
  clearTag(){
    this.spinner.show()
    this.selectedTag = 'Tags'
    this.fetchData(0)
  }

  // detect scroll on post listing
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    if(pos == max){
      this.postOffset = this.postData.length
      if(this.postOffset < this.postTotal && this.postLoader == true){
        this.postSpinner = true
        this.fetchData(this.postPage + 1, this.selectedTag)
      }
    }
  }

  // detect scroll on tag listing inside dropdown
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.tagsOffset = this.tagsData.length
      if(this.tagsOffset < this.tagsTotal && this.tagsLoader == true){
        this.tagsSpinner = true
        this.fetchTag(this.tagsPage + 1)
      }
    }
}

}

// define page route
export const DashboardRoute: INavRoute = {
  path: 'dashboard',
  component: DashboardComponent,
  data: {
    breadcrumb : 'Dashboard'
  },
};
