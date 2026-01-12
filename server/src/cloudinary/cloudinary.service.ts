import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: 'products',
                    allowed_formats: ['jpg', 'png', 'jpeg'],
                    transformation: [{ width: 500, height: 500, crop: 'limit' }],
                },
                (error, result) => {
                    if (error) return reject(error);
                    
                    if (!result) {
                        return reject(new Error('Cloudinary upload failed: No result returned'));
                    }
                    resolve(result);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(upload);
        });
    }

}