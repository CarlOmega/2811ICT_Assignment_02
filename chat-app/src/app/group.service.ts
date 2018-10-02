// ============================================
// This service is responsible for CRUD actions
// to the group APIs
// ============================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Observable, of} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  /*
  this service allows the angular project to make api requests to
  perform CRUD actions on the databse.
  This service mainly deals with the groups collection.
  */
  private api:string = 'http://localhost:3000/api/';

  constructor(private http:HttpClient) {}
  //used to update a user in groups or channels
  update(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'user/change', body, httpOptions);
  }
  //create a new group
  createGroup(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'group/create', body, httpOptions);
  }
  //create a new channel
  createChannel(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'channel/create', body, httpOptions);
  }
  //delte a group
  deleteGroup(groupName){
    return this.http.delete(this.api + 'group/delete/' + groupName);
  }
  //delete a channel
  deleteChannel(channelName, groupName){
    let params = new HttpParams().set('channelName', channelName).set('groupName', groupName);
    return this.http.delete(this.api + 'channel/delete/', {params: params});
  }
  //get all groups the user is in
  getGroups(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'groups', body, httpOptions);
  }

}
