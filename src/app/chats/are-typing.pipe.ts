import { Sender } from './../common/message.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'areTyping'
})
export class AreTypingPipe implements PipeTransform {

  transform(users: Array<Sender> | null, ...args: unknown[]): unknown {

    if (!users || !users.length) {
      return
    }


    if (users.length == 1) {
      return `${users[0].name}#${users[0].id} is typing`
    }

    let typingMsg = '';
    users.forEach((user: Sender, index) => {
      if (index == users.length - 1) {
        typingMsg += ` and `
      }
      typingMsg += `${user.name}#${users[0].id}`
      if (index != users.length - 1) {
        typingMsg += `, `
      }
    })
    typingMsg += ` are typing`

    return typingMsg;
  }

}
