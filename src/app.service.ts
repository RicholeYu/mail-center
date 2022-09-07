import * as path from 'path';
import * as fs from 'fs/promises';
import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { Params } from './app.controller';
const configPath = process.env.MAIL_CENTER_CONFIG;
const tmpDir = process.env.MAIL_CENTER_TMP_DIR;

const config = JSON.parse(readFileSync(configPath).toString());
const from = `${config.name} <${config.auth.user}>`;

@Injectable()
export class AppService {
  async sendEmail(option: Params): Promise<string> {
    try {
      const attachments = await this.initAttachments(option);
      const info = await nodeMailer
        .createTransport({
          ...config,
        })
        .sendMail({
          ...option,
          from,
        });

      await this.deleteAttachments(attachments);

      if ((info.response as string).startsWith('250')) {
        return 'ok';
      }

      throw new Error(info);
    } catch (e) {
      console.error(`邮件发送失败: ` + e.response);
      return 'error ' + e.response;
    }
  }

  async initAttachments(option: Params) {
    option.attachments = option.attachments || [];
    const attachments = await Promise.all(
      option.attachments.map(async (attachment) => {
        if (attachment.filename && attachment.base64) {
          const filename = attachment.filename;
          const data = Buffer.from(attachment.base64, 'base64');
          const randomName = `${Date.now()}_${~~(
            Math.random() * 1000000
          )}_${filename}`;
          const filepath = path.resolve(tmpDir, randomName);
          attachment.path = filepath;
          attachment.cid = randomName;

          await fs.writeFile(filepath, data);

          return filepath;
        }

        return '';
      }),
    );

    return attachments.filter(Boolean);
  }

  deleteAttachments(attachments: string[]) {
    return Promise.all(
      attachments.map(async (attachment) => {
        await fs.rm(attachment);
      }),
    );
  }
}
