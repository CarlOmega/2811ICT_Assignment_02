import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { GroupService } from '../group.service';
import { SocketService } from '../socket.service';
import { ImageService } from '../image.service';
import { UserService } from '../user.service';

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
  public obmessages: any = null;
  public messages: any;
  public obusers: any = null;
  public users: any;
  public allusers: any;
  public messageImage: any = null;
  constructor(private router: Router, private _groupService: GroupService, private _socketService: SocketService, private _imageService: ImageService, private _userService: UserService) { }

  ngOnInit() {
    if(sessionStorage.getItem('user') === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.user = user;
      console.log(this.user);
      this.groups = this.user.groups;
      this._socketService.signin();
      if (this.user.permissions == 2) {
        this._userService.getUsers().subscribe((data: any) => {
          this.allusers = data;
        });
      }
      if(this.groups.length > 0){
        this.openGroup(this.groups[0].name);
        if(this.groups[0].channels.length > 0){
          this.channelChangedHandler(this.groups[0].channels[0].name);
        }
      }
    }
  }

  imageChanged(event) {
    const fd = new FormData();
    fd.append('image',event.target.files[0],event.target.files[0].name);
    this._imageService.imgupload(fd).subscribe((data: any)=> {
      console.log(data);
      let userstuff = {
        url: data.url,
        username: this.user.username
      };
      this._userService.changeImage(userstuff).subscribe((r: any)=> {
        console.log(r);
        this.user.profile = r.url;
        sessionStorage.setItem('user', JSON.stringify(this.user));
      });
    });
  }

  fileSelected(event) {
    console.log(event);
    this.messageImage = event.target.files[0];
  }

  sendMessage(message) {
    console.log(message);
    if (this.messageImage) {
      const fd = new FormData();
      console.log(this.messageImage);
      fd.append('image',this.messageImage,this.messageImage.name);
      this._imageService.imgupload(fd).subscribe((data: any)=> {
        console.log(data);
        this._socketService.sendMessage(message, this.user.username, this.selectedGroup.name, data.url, this.user.profile);
        this.messageImage = null;
      });
    } else {
      this._socketService.sendMessage(message, this.user.username, this.selectedGroup.name, null, this.user.profile);
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

  update(type, username, groupName, channelName) {
    let data = {
      'type': type,
      'username': username,
      'groupName': groupName,
      'channelName': channelName
    };
    this._groupService.update(data).subscribe((res) => {
      
    })

  }

  createUser(username, email, password) {
    let data = {
      'username': username,
      'email': email,
      'password': password
    }
    this._userService.create(data).subscribe((user) => {
      if (user != false) {
        this._userService.getUsers().subscribe((data: any) => {
          this.allusers = data;
        });
      } else {
        console.log("Cannot create that user.");
      }

    });
  }

  deleteUser(id) {
    this._userService.delete(id).subscribe((user) => {
      this._userService.getUsers().subscribe((data: any) => {
        this.allusers = data;
      });
    });
  }

  deleteGroup(groupName){
    this._groupService.deleteGroup(groupName).subscribe(
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
    this._socketService.signout();
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
        this._socketService.joinRoom(this.selectedChannel.name, this.user.username);
        this.messages = this.selectedChannel.history;
        if (this.obmessages != null) {
          this.obmessages.unsubscribe();
        }
        this.obmessages = this._socketService.getMessages().subscribe((data)=> {
          console.log(data);
          this.messages.push(data);
          sessionStorage.setItem('user', JSON.stringify(this.user));
        });
        if (this.obusers != null) {
          this.obusers.unsubscribe();
        }
        this.obusers = this._socketService.getUsers().subscribe((data)=> {
          console.log(data);
          this.users = data;
        });
        found = true;
      }
    }
    return found;
  }

}
