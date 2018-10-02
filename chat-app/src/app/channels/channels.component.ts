import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  /*
  this component allows dynamic loading of the channels and enables 
  linking functions to when the user clicks a channel.
  */
  @Input() channels;
  @Input() group;
  @Input() user;
  @Output() channelChanged: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  //notfiy parent that user has changed channel
  changeChannel(name){
    // console.log("changeChannel("+name+")");
    this.channelChanged.emit(name);
  }

}
