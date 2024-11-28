"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const clientS3 = new client_s3_1.S3Client({ region: process.env.AWS_DEFAULT_REGION });
exports.clientS3 = clientS3;
