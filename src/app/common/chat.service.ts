import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import Message from './message.model';
import { SocketsEvents } from './enums.helpers';

/**
 * Contains methods and variables to handle
 * socket chat connection and events
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  /**
   * Messages data source
   */
  private messages = new BehaviorSubject<Array<Message>>(new Array(0));

  /**
   * IO Socket
   */
  private chatSocket: Socket = io(environment.backendUrlWS);


  constructor() {
    this.initializeSocket();
    this.messages.value.push(new Message('dsadads', 'dsaddsa'));
  }

  /**
   * Initializes the socket to add a message to messages data source
   * when a message is emitted from the server
   */
  initializeSocket() {
    this.chatSocket.on(SocketsEvents.message, (message: Message) => {
      this.messages.value.push(new Message(message.content, message.sender, message.date));
    });
  }

  /**
   * @returns message data source as Observable
   */
  getMessages(): Observable<Array<Message>> {
    return this.messages.asObservable();
  }

  /**
   * Sends a message object through the chat socket
   *
   * @param message message to be sent
   */
  sendMessage(message: Message): void {
    this.chatSocket.emit(SocketsEvents.message, message);
  }
}
