import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { forkJoin } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";

var env = environment;

@Injectable({
  providedIn: 'root'
})
export class PostService {

  headersOption = {
    headers: new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      "Accept": "application/json",
      "Authorization": "",
      "app-id": env.appId
    })
  };

  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  // get post list
  async getAllPost(params = {}){
    if(params['tag'] == undefined){
      var endpoint = 'post?page='+ params['page'] +'&limit=10'
    } else {
      var endpoint = 'tag/'+ params['tag'] +'/post?page='+ params['page'] +'&limit=10'
    }
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + endpoint, this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }

  // get single post
  async getSinglePost(id:string = '') {
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + 'post/'+ id , this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }

  // get post created by user
  async getUserPost(page:number = 0,id:string = '') {
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + 'user/'+ id +'/post?page='+ page +'&limit=10', this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
          this.spinner.hide()
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }

  // get tag list
  async getTags(page:number = 0){
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + 'tag?page='+ page +'&limit=10', this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
          this.spinner.hide()
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }

  // get post comment list
  async getComment(id:string = '') {
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + 'post/'+ id +'/comment', this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
          this.spinner.hide();
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }

  // initial get attribute
  getDetailPost(id:string = '') {
    const postData = this.getSinglePost(id);
    const commentData = this.getComment(id);
    return forkJoin({
      postData: postData,
      commentData: commentData
    });
  }
}
