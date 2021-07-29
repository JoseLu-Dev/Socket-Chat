import { Observable } from 'rxjs';
import { ChatService } from './../common/chat.service';
import { Component } from '@angular/core';
import { Message } from '../common/message.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {

  /**
   * String message that will be sended
   * linked with an <input> with ngModel
   */
  message: string = '';

  /**
   * Observable array of messages
   */
  messages: Observable<Array<Message>>;

  constructor(
    public chatService: ChatService,
    private location: Location) {
    this.messages = this.chatService.getMessages();
  }

  /**
   * Sends a message using chat service
   */
  sendMessage(): void {
    if (!this.message) { return; }
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  /**
   * Goes one route back
   */
  goBack(): void {
    this.location.back();
  }
}
