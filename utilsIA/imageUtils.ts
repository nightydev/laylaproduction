import fs from 'fs';

export default function encodeImageToBase64(filePath: string) {
  const image = fs.readFileSync(filePath);
  return Buffer.from(image).toString('base64');
}
