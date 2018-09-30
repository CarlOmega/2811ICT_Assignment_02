import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GroupService } from '../group.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user;
  public selectedGroup;
  public selectedChannel;
  public groups: any;
  public channels = [];
  public newGroupName: String;
  public newChannelName: String;

  constructor(private router: Router, private _groupService: GroupService, socketService: SocketService) { }

  ngOnInit() {
    if(sessionStorage.getItem('user') === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.user = user;
      console.log(this.user);
      this.groups = this.user.groups;
      if(this.groups.length > 0){
        console.log("WTF?")
        console.log(this.groups);
        this.openGroup(this.groups[0].name);
        if(this.groups[0].channels > 0){
          this.channelChangedHandler(this.groups[0].channels[0].name);
        }
      }
    }
  }

  createGroup(event){
    event.preventDefault();
    let data = {
      'newGroupName': this.newGroupName,
      'username': this.user.username
    };
    this._groupService.createGroup(data).subscribe(
      newGroup => {
        if (newGroup){
          this.groups.push(newGroup);
          sessionStorage.setItem('user', JSON.stringify(this.user));
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  createChannel(event){
    event.preventDefault();
    if (this.selectedGroup) {
      let data = {
        'groupName': this.selectedGroup.name,
        'newChannelName': this.newChannelName,
        'username': this.user.username
      };
      this._groupService.createChannel(data).subscribe(
        newChannel => {
          if (newChannel) {
            this.selectedGroup.channels.push(newChannel);
            sessionStorage.setItem('user', JSON.stringify(this.user));
          }
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  deleteChannel(channelName){
    this._groupService.deleteChannel(channelName, this.selectedGroup.name).subscribe(
      data=>{
        this.selectedChannel = null;
        for (var i =0; i < this.selectedGroup.channels.length; i++) {
          if (this.selectedGroup.channels[i].name == channelName) {
            this.selectedGroup.channels.splice(i, 1);
            break;
          }
        }
        this.channels = this.selectedGroup.channels;
        sessionStorage.setItem('user', JSON.stringify(this.user));
      }, error =>{
        console.error(error)
      }
    )
  }

  deleteGroup(groupName){
    this._groupService.deleteGroup(groupName, this.user.username).subscribe(
      data=>{
        this.selectedChannel = null;
        for (var i =0; i < this.groups.length; i++) {
          if (this.groups[i].name == groupName) {
            this.groups.splice(i, 1);
            break;
          }
        }
        if (this.groups.length > 0) {
          this.openGroup(this.groups[0].name);
          if(this.groups[0].channels > 0){
            this.channelChangedHandler(this.groups[0].channels[0].name);
          }
        } else {
          this.selectedGroup = null;
        }
        sessionStorage.setItem('user', JSON.stringify(this.user));
      }, error =>{
        console.error(error)
      }
    )
  }

  getGroups(){
    let data = {
      'username': JSON.parse(sessionStorage.getItem('user')).username
    }
    this._groupService.getGroups(data).subscribe(groups => {
        console.log('getGroups()');
        console.log(groups);
        this.groups = groups;
        sessionStorage.setItem('user', JSON.stringify(this.user));
      },
      error => {
        console.error(error);
      }
    )
  }

  logout(){
    
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Determine which group is currently selected and pass onto the child panel
  openGroup(name){
    console.log(name);
    for(let i = 0; i < this.groups.length; i++){
      if(this.groups[i].name == name){
        this.selectedGroup = this.groups[i];
      }
    }
    this.channels = this.selectedGroup.channels;
  }

  // Responsible for handling the event call by the child component
  channelChangedHandler(name){
    let found:boolean = false;
    for(let i = 0; i < this.channels.length; i++){
      if(this.channels[i].name == name){
        this.selectedChannel = this.channels[i];
        found = true;
      }
    }
    return found;
  }

  getChannels(groupName){
    let channels = [];
    return channels;
  }
}
