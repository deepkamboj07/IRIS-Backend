export class UploadImageDTO {
  file: Express.Multer.File;

  constructor(file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }

    if (!/^image\/(jpeg|png|jpg|webp)$/.test(file.mimetype)) {
      throw new Error('File type must be jpeg, png, jpg, or webp');
    }

    this.file = file;
  }
}
