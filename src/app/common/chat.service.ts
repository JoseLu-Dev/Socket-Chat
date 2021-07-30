import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { last, throttleTime } from 'rxjs/operators';
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
   * Users that are currently typing
   */
  private usersTyping = new BehaviorSubject<Array<Sender>>(new Array(0));

  /**
   * Messages data source
   */
  private messages = new BehaviorSubject<Array<Message>>(new Array(0));

  /**
   * If user is currently typing
   */
  private userIsTyping = new BehaviorSubject<Boolean>(false);

  /**
   * IO Socket
   */
  private chatSocket: Socket = io(environment.backendUrlWS);

  /**
   * Time in milliseconds to detect when the users stops typing
   */
  private TYPING_TIMEOUT: number = 3000;


  constructor() {
    this.initializeSocket();
    this.setOnUserTyping();
  }


  initializeSocket() {
    this.handleMessages();
    this.handleId();
    this.handleSomeoneTyping();
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
    })
  }

  /**
   * Handles when writing event is received
   */
  handleSomeoneTyping() {
    this.chatSocket.on(SocketsEvents.writing, (sender: Sender, isTyping: boolean) => {
      // If the sender is the user of this client then return
      if (this.sender.id === sender.id) { return }

      const userInArray = this.usersTyping.value.find((userTyping: Sender) => { return userTyping.id === sender.id });

      // If user typing i not in the array then add him to it
      if (userInArray == undefined) {
        this.usersTyping.value.push(sender);
        this.usersTyping.next(new Array(...this.usersTyping.value))
      }

      // If the user isn't typing then try to remove him of the array
      if (!isTyping) {
        this.usersTyping.next(this.usersTyping.value.filter((userTyping: Sender) => { return userTyping.id !== sender.id }))
      }
    })
  }

  /**
   * Sends userIsTyping observable value with sockets to the server
   * and changes the value to false after TYPING_TIMEOUT seconds variable
   */
  setOnUserTyping() {
    this.userIsTyping.pipe().subscribe((isTyping) => {
      this.chatSocket.emit(SocketsEvents.writing, this.sender, isTyping);
      setTimeout(() => {
        if (this.userIsTyping.value) {
          this.userIsTyping.next(false)
        }
      }, this.TYPING_TIMEOUT)
    })
  }

  /**
   * @returns message data source as Observable
   */
  getMessages(): Observable<Array<Message>> {
    return this.messages.asObservable();
  }

  /**
   * @returns usersTyping data source as Observable
   */
  getUsersTyping() {
    return this.usersTyping.asObservable();
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
    this.userIsTyping.next(false);
  }

  /**
   * @returns user id
   */
  getUserId(): number {
    return this.sender.id;
  }

  /**
   * Sets the user name
   * 
   * @param name name of the user
   */
  setUserName(name: string): void {
    this.sender.name = name;
  }

  /**
   * Sends an event to indicate that the user
   * is currently typing a message
   */
  typingMessage(): void {
    if (!this.userIsTyping.value) {
      this.userIsTyping.next(true);
    }
  }
}
