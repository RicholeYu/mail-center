import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

export interface Params {
  from?: string;
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: attachment[];
}

type attachment = {
  path: string;
  filename: string;
  cid: string;
  base64: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/')
  async mailer(@Body() body: Params) {
    return await this.appService.sendEmail(body);
  }
}
