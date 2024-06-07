import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('messages/:chatId')
  async getMessages(@Param('chatId') chatId: number) {
    return this.appService.getMessagesByChatId(chatId);
  }

  @Get('chats/previews')
  async getChatPreviews() {
    return this.appService.getChatPreviewsWithHandles();
  }

  @Get('chats/preview/:chatId')
  async getChatPreview(@Param('chatId') chatId: number) {
    return this.appService.getChatPreviewWithHandles(chatId);
  }

  @Get('contacts/listhandle/:handleId')
  async getListHandle(@Param('handleId') handleId: string) {
    return this.appService.getHandleContact(handleId);
  }

  @Get('contacts/listhandles/:handleIds')
  async getListHandles(@Param('handleIds') handleIds: string) {
    return this.appService.getHandleContacts(handleIds);
  }

}
