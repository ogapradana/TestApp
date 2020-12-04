import { Component, OnInit } from '@angular/core';
import { INavRoute } from '@service/navigation.service';
import { PostService } from '@resource/post.service';
import { paramsTree } from '@helper/route.helper';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  postId: any
  commentData = []
  postData = {}
  ownerPost = {}

  constructor(
    private activatedRoute: ActivatedRoute,
    private postAPI: PostService,
    private ngxSpinner: NgxSpinnerService,
  ) {
    const params = paramsTree(this.activatedRoute.snapshot);
    this.postId = params.id;
  }

  ngOnInit(): void {
    this.ngxSpinner.show()
    this.fetchData(this.postId)
  }

  fetchData(id:string = ''){
    this.postAPI.getDetailPost(id).toPromise()
    .then((resp:any)=>{
      this.ownerPost = resp.postData.owner
      this.commentData = resp.commentData.data
      this.postData = resp.postData
    }).catch((error) => {
      console.log(error)
    })
  }

}

// define page route
export const PostDetailRoute: INavRoute = {
  path: 'post/:id',
  data: {
    breadcrumb : 'Post',
    click: false
  },
  children: [
    {
      path: 'detail',
      data: {
        breadcrumb : 'Post Detail',
        click: false
      },
      component: PostDetailComponent,
    }
  ]
};