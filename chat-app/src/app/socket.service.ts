import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  private socket;
  private currentRoom = null;
  constructor() {}

  signin() {
    this.socket = io(this.url);
  }

  joinRoom(room) {
    if (this.currentRoom) {
      this.socket.emit('leave room', this.currentRoom);
    }
    this.currentRoom = room;
    this.socket.emit('join room', room);
  }

  sendMessage(newMessage, username, groupName, url) {
    let data = {
      room: this.currentRoom,
      message: newMessage,
      author: username,
      group: groupName,
      photo: url
    };
    this.socket.emit('message', data);
  }

  getMessages() {
    let obmessages = new Observable(observer => {
      this.socket.removeAllListeners('message');
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return obmessages;
  }

  signout() {
    this.currentRoom = null;
    this.socket.disconnect();
  }
}
