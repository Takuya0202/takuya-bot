import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

export const uploadToR2 = async (buffer, filename, contentType) => {
  const id = v4();
  const ext = filename.split(".").pop();
  await S3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `clips/${id}.${ext}`,
    Body: buffer,
    ContentType: contentType,
  }));

  return `${process.env.R2_PUBLIC_URL}/clips/${id}.${ext}`;
};