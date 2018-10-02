// ============================================
// This service is responsible for CRUD actions
// to the user APIs
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /*
  This service allows the angular project to make connection
  to the REST api to perform CRUB actions on the user collection. 
  these include loggin in and updating users.
  */
  private api:string = 'http://localhost:3000/api/';

  constructor(private http:HttpClient) {}
  // login api request
  login(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'login', body, httpOptions);
  }
  // get all users used for super admin
  getUsers() {
      return this.http.get(this.api + 'getusers');
  }
  // create a user
  create(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'user/create', body, httpOptions);
  }
  // change the image on a profile
  changeImage(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'user/changeimage', body, httpOptions);
  }
  //delete a user
  delete(id){
    return this.http.delete(this.api + 'user/delete/' + id);
  }
  //promote a user to super or demote them
  promote(id, type){
    let data = {
      'id': id,
      'type': type
    };
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'user/promote/', body, httpOptions);
  }
}
