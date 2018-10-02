import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /*
  This service allows the angular project to use sockets to
  communicate realtime messages to the server and other clients.
  this deals with joining rooms and sending messages.
  */
  private url = 'http://localhost:3000';
  private socket;
  private currentRoom = null;
  constructor() {}
  // connect to the socket
  signin() {
    this.socket = io(this.url);
  }
  // join a room on the server
  joinRoom(room, username) {
    if (this.currentRoom) {
      this.socket.emit('leave room', {'username': username, 'room': this.currentRoom});
    }
    this.currentRoom = room;
    this.socket.emit('join room', {'username': username, 'room': this.currentRoom});
  }
  //send message or photo message
  sendMessage(newMessage, username, groupName, url, profileUrl) {
    let data = {
      room: this.currentRoom,
      message: newMessage,
      author: username,
      group: groupName,
      photo: url,
      profile: profileUrl
    };
    this.socket.emit('message', data);
  }
  //get new messages
  getMessages() {
    let obmessages = new Observable(observer => {
      this.socket.removeAllListeners('message');
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return obmessages;
  }
  //get online status of users
  getUsers() {
    let obusers = new Observable(observer => {
      this.socket.removeAllListeners('user');
      this.socket.on('user', (data) => {
        observer.next(data);
      });
    });
    return obusers;
  }
  //disconnect
  signout() {
    this.currentRoom = null;
    this.socket.disconnect();
  }
}
