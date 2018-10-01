import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  private socket;

  constructor() {}

  signin() {
    this.socket = io(this.url);
  }

  joinRoom(room) {
    this.socket.emit('join room', room);
  }

  signout() {
    this.socket.disconnect();
  }
}
