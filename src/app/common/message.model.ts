export default class Message {
    sender: string;
    content: string;
    date: Date;

    constructor(content: string, sender: string, date?: Date) {
        this.sender = sender;
        this.content = content;

        if (!date) {
            this.date = new Date();
        }else{
            this.date = new Date(date);
        }
    }
}
