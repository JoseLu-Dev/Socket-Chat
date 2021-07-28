import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../common/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  name: string = ''

  constructor(
    private chatService: ChatService,
    private router: Router) { }

  ngOnInit(): void {
  }

  setName() {
    if (!this.name) { return; }

    this.chatService.setUserName(this.name);

    this.router.navigateByUrl('/chats')
  }

}
