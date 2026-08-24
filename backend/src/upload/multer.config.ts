import { diskStorage } from 'multer';
import { extname } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function multerOptions(subfolder: string): MulterOptions {
  return {
    storage: diskStorage({
      destination: `./uploads/${subfolder}`,
      filename: (_req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  };
}

export function buildFileUrl(subfolder: string, filename: string): string {
  const port = process.env.PORT || 3001;
  return `http://localhost:${port}/uploads/${subfolder}/${filename}`;
}
