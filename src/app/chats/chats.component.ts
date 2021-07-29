import { Observable } from 'rxjs';
import { ChatService } from './../common/chat.service';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../common/message.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, AfterViewChecked {

  @ViewChild('chat') private chatContainer!: ElementRef;

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

  ngOnInit(): void {
    this.scrollChatToBottom();
  }

  /**
   * Scrolls chat if scrollbar is near bottom
   */
  ngAfterViewChecked(): void {
    const chatContainer = this.chatContainer.nativeElement;
    const scrollPercentage =  (chatContainer.scrollHeight - chatContainer.clientHeight) - chatContainer.scrollTop;
    if (scrollPercentage != 0 && scrollPercentage < 150) { this.scrollChatToBottom(); }
  }

  /**
   * Sends a message using chat service
   */
  sendMessage(): void {
    if (!this.message) { return; }
    this.chatService.sendMessage(this.message);
    this.message = '';

    this.scrollChatToBottom();
  }

  /**
   * Goes one route back
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Scrolls chat div to bottom
   */
  scrollChatToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) { console.log(err) }
    })
  }
}
