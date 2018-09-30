import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  @Input() channels;
  @Input() group;
  @Input() user;
  @Output() channelChanged: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    var temp = [];
    for (var i = 0; i < this.channels.length; i++) {
      if (this.channels[i].members.includes(this.user.username) || this.group.role > 0) {
        temp.push(this.channels[i]);
      }
    }
    this.channels = temp;
  }

  changeChannel(name){
    // console.log("changeChannel("+name+")");
    this.channelChanged.emit(name);
  }

}
