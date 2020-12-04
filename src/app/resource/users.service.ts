import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

var env = environment;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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
  ) { }

  // get users list
  async getUser(page:number = 0, limit: number = 5) {
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + 'user?page='+ page +'&limit='+ limit, this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }

  // get user full profile
  async getUserProfile(userId:string = '') {
    return await new Promise((resolve, reject) => {
      this.httpClient.get(env.host + 'user/' + userId , this.headersOption)
        .toPromise()
        .then((result: any) => {
          resolve(result);
        })
        .catch(error => {
          reject(error.error);
        });
    });
  }
  
}
