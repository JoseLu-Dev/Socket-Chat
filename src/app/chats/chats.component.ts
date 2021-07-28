import { Observable } from 'rxjs';
import { ChatService } from './../common/chat.service';
import { Component } from '@angular/core';
import Message from '../common/message.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {

  message: string = '';

  messages: Observable<Array<Message>>;

  constructor(private chatService: ChatService) {
    this.messages = this.chatService.getMessages();
  }

  sendMessage() {
    if (!this.message) { return; }

    const message = new Message(this.message, 'null');
    this.message = '';
    this.chatService.sendMessage(message);
  }
}
