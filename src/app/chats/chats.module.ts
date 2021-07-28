import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsComponent } from './chats.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChatsComponent
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    FormsModule,
  ]
})
export class ChatsModule { }
