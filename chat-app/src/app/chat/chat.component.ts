import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

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
  @Output() fileChanged: EventEmitter<string> = new EventEmitter();
  @ViewChild('chat') private myScrollContainer: ElementRef;
  message: any;
  constructor() { }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  fileSelected(event) {
    this.fileChanged.emit(event);
  }

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }

  sendMessage(){
    console.log("messageSend("+this.message+")");
    this.messageSend.emit(this.message);
    this.scrollToBottom();
  }

}
