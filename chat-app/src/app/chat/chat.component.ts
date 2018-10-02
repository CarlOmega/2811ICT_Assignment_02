import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  /*
  this component is a simple chat box that auto scrolls
  to bottom and allows the user to enter images and messages to send.
  */
  @Input() channel;
  @Input() username;
  @Input() messages: any;
  @Output() messageSend: EventEmitter<string> = new EventEmitter();
  @Output() fileChanged: EventEmitter<string> = new EventEmitter();
  @ViewChild('chat') private myScrollContainer: ElementRef;
  message: any;
  constructor() { }
  //scroll to bottom if new message
  ngOnInit() {
    this.scrollToBottom();
  }
  //scroll to bottom if new message
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  //update on image sleected notify parent
  fileSelected(event) {
    this.fileChanged.emit(event);
  }
  //function to scoll panel to bottom
  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }
  //notfiy parent that user wants to send message
  sendMessage(){
    if (this.message) {
      console.log("messageSend("+this.message+")");
      this.messageSend.emit(this.message);
      this.scrollToBottom();
    }
    this.message = '';
  }

}
