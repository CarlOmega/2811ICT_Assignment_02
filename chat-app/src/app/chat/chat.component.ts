import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() channel;
  @Input() username;
  @Input() messages: any;
  @Output() messageSend: EventEmitter<string> = new EventEmitter();
  message: any;
  constructor() { }

  ngOnInit() {
  }

  sendMessage(){
    console.log("messageSend("+this.message+")");
    this.messageSend.emit(this.message);
  }

}
