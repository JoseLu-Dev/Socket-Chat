export class Message {
    sender!: Sender ;
    content: string;
    date: Date;
    sended: boolean;

    constructor(content: string, sender: Sender, date?: Date) {
        this.sender = sender;
        this.content = content;

        if (!date) {
            this.date = new Date();
        }else{
            this.date = new Date(date);
        }

        this.sended = false;
    }
}

export class Sender{
    name!: string;
    id!: number;

    constructor(){

    }
}