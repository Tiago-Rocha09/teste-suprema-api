"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUrl = fileUrl;
exports.fileNameFromUrl = fileNameFromUrl;
exports.uploadToS3 = uploadToS3;
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = __importDefault(require("path"));
function generateFileName(name) {
    const timestamp = Date.now();
    const ext = path_1.default.extname(name);
    const nameWithoutExt = path_1.default.basename(name, ext);
    const fileNameWithTimestamp = `${nameWithoutExt}-${timestamp}${ext}`;
    return fileNameWithTimestamp;
}
function fileUrl(name) {
    return `${process.env.AWS_CLOUDFRONT_DNS}/${name}`;
}
function fileNameFromUrl(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}
function uploadToS3(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = generateFileName(file.originalname);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        try {
            const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_DEFAULT_REGION });
            yield s3Client.send(command);
            return fileName;
        }
        catch (err) {
            console.error({ err });
            throw new Error("Não foi possível salvar os arquivos");
        }
    });
}
