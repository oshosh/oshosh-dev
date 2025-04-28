import { v2 as cloudinary } from 'cloudinary';
import https from 'https';

class CloudinaryApi {
  constructor() {
    // cloudinary 설정 초기화
    const cloudinaryUrl = process.env.CLOUDINARY_URL!;
    const urlRegex = /^cloudinary:\/\/([a-z0-9-_]+):([a-z0-9-_]+)@([a-z0-9-_]+)$/i;

    if (!urlRegex.test(cloudinaryUrl)) {
      throw new Error(
        `유효하지 않은 Cloudinary URL입니다. ${urlRegex.toString()} 형식이어야 합니다.`
      );
    }

    const [, apiKey, apiSecret, cloudName] = cloudinaryUrl.match(urlRegex) ?? [];

    cloudinary.config({
      secure: true,
      api_key: apiKey,
      api_secret: apiSecret,
      cloud_name: cloudName,
    });
  }

  // 호스팅된 이미지를 다운로드하여 base64 문자열로 변환
  private downloadImageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = https.request(url, (response) => {
        const chunks: unknown[] = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const result = Buffer.concat(chunks as ReadonlyArray<Uint8Array>);
          resolve(result.toString('base64'));
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  // cloudinary uploader를 통해 이미지 업로드
  private uploadImage(image: string, options = {}): Promise<{ url: string }> {
    return cloudinary.uploader
      .upload(image, options)
      .then((result) => ({
        url: result.secure_url,
      }))
      .catch((error) => {
        console.error(error);
        return { url: '' };
      });
  }

  // notion image를 영구 이미지로 변환
  async convertToPermanentImage(notionImageUrl: string, title: string): Promise<string> {
    const imgBase64 = await this.downloadImageToBase64(notionImageUrl);
    const { url: cloudinaryUrl } = await this.uploadImage(`data:image/jpeg;base64,${imgBase64}`, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER!,
      public_id: title.split(' ').join('_').trim(),
      overwrite: true,
    });

    return cloudinaryUrl;
  }
}

export const cloudinaryApi = new CloudinaryApi();
