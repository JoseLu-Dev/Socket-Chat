import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Message, Sender } from './message.model';
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
   * Info about who sends a message
   */
  private sender: Sender = new Sender();

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
  }


  initializeSocket() {
    this.handleMessages();
    this.handleId();
  }

  /**
   * Initializes the socket to add a message to messages data source
   * when a message is emitted from the server
   */
  private handleMessages() {
    this.chatSocket.on(SocketsEvents.message, (messageReceived: Message) => {
      if (messageReceived?.sender?.id == this.sender.id) {
        this.messages.value.forEach((message: Message) => {
          if (JSON.stringify(message) == JSON.stringify(messageReceived)) {
            message.sended = true;
            return;
          }
        })
        return
      }

      this.messages.value.push(new Message(messageReceived.content, messageReceived.sender, messageReceived.date));
    });
  }

  /**
   * Handles ID association that the server gives to the user
   */
  private handleId() {
    this.chatSocket.on(SocketsEvents.identification, (id: number) => {
      this.sender.id = id;
      console.log(id)
    })
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
  sendMessage(msg: string): void {
    const message = new Message(msg, this.sender)
    this.messages.value.push(message);
    this.chatSocket.emit(SocketsEvents.message, message);
  }

  getUserId(): number { 
    return this.sender.id;
  }

  setUserName(name: string): void{
    this.sender.name = name;
  }
}
