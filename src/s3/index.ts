import { S3Client } from "@aws-sdk/client-s3";

const clientS3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });

export { clientS3 };
