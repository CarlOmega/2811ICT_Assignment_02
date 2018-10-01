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
  

  signout() {
    this.currentRoom = null;
    this.socket.disconnect();
  }
}
