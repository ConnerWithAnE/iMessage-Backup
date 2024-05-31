import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('messages/:chatId')
  async getMessages(@Param('chatId') chatId: number) {
    return this.appService.getMessagesByChatId(chatId);
  }

}
