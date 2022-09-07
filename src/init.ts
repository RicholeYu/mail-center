import * as fs from 'fs';

const configPath = process.env.MAIL_CENTER_CONFIG;
const tmpDir = process.env.MAIL_CENTER_TMP_DIR;

export default async function init() {
  if (!configPath || !fs.existsSync(configPath)) {
    console.error('failed to load config');
    process.exit(0);
  }

  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, {
      recursive: true,
      force: true,
    });
  }

  fs.mkdirSync(tmpDir);
}
