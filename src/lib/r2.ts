import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    }),
  );

  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}

export async function uploadRemoteFileToR2(fileUrl: string, fileName: string, fallbackContentType: string): Promise<string> {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(`Failed to download file before R2 upload: ${response.status}`);
  }

  const fileBuffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? fallbackContentType;

  return uploadToR2(fileBuffer, fileName, contentType);
}
