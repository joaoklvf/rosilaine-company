import { Component } from '@angular/core';
import { MessageService } from '../services/message/message.service';
@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: false
})
export class MessagesComponent {
  constructor(public messageService: MessageService) {}
}
