import { Observable } from 'rxjs';
import { ChatService } from './../common/chat.service';
import { Component } from '@angular/core';
import { Message } from '../common/message.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {

  message: string = '';

  messages: Observable<Array<Message>>;

  constructor(public chatService: ChatService) {
    this.messages = this.chatService.getMessages();
  }

  sendMessage() {
    if (!this.message) { return; }
    this.chatService.sendMessage(this.message);
    this.message = '';
  }
}
