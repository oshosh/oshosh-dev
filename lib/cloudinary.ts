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

  private async convertNotionImageToPermanent(imageUrl: string, pageId: string): Promise<string> {
    // 이미 cloudinary URL이면 변환하지 않음
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl;
    }

    // 만료 시간이 있는 노션 이미지를 Cloudinary로 변환
    return await this.convertToPermanentImage(imageUrl, `${pageId}_cover_image`);
  }

  // URL에서 간단한 해시 생성
  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32비트 정수로 변환
    }
    return Math.abs(hash).toString(36);
  }

  async convertMarkdownImages(markdown: string, pageId: string): Promise<string> {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]+)")?\)/g;

    let convertedMarkdown = markdown;
    const imageMatches = [...markdown.matchAll(imageRegex)];

    for (const match of imageMatches) {
      const [fullMatch, alt, imageUrl, title] = match;

      // 이미 Cloudinary URL이면 건너뛰기 (가장 빠른 방법)
      if (imageUrl.includes('cloudinary.com')) {
        continue;
      }

      // 노션 이미지 URL인지 확인
      if (
        imageUrl.includes('prod-files-secure.s3.us-west-2.amazonaws.com') ||
        imageUrl.includes('www.notion.so')
      ) {
        try {
          // URL 해시로 일관된 public_id 생성
          const urlHash = this.generateHash(imageUrl);
          const publicId = `${pageId}_content_${urlHash}`;

          // 바로 업로드 (API 확인 없이)
          const permanentUrl = await this.convertNotionImageToPermanent(imageUrl, publicId);

          const newImageMarkdown = title
            ? `![${alt}](${permanentUrl} "${title}")`
            : `![${alt}](${permanentUrl})`;

          convertedMarkdown = convertedMarkdown.replace(fullMatch, newImageMarkdown);
        } catch (error) {
          console.error('이미지 변환 실패:', error);
        }
      }
    }

    return convertedMarkdown;
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
