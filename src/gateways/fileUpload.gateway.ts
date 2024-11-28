import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { unlink } from "fs";
import path from "path";
import { clientS3 } from "../s3";
import { promisify } from "util";

function generateFileName(name: string) {
  const timestamp = Date.now();

  const ext = path.extname(name);
  const nameWithoutExt = path.basename(name, ext);

  const fileNameWithTimestamp = `${nameWithoutExt}-${timestamp}${ext}`;

  return fileNameWithTimestamp;
}

export function fileUrl(name: string) {
  return `${process.env.AWS_CLOUDFRONT_DNS}/${name}`;
}

export function fileNameFromUrl(url: string) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

export async function uploadToS3(
  file: Express.Multer.File
): Promise<string> {

  const fileName = generateFileName(file.originalname);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    const s3Client = new S3Client({ region: process.env.AWS_DEFAULT_REGION });
    await s3Client.send(command);
    return fileName;
  } catch (err) {
    console.error({ err });
    throw new Error("Não foi possível salvar os arquivos");
  }
}
