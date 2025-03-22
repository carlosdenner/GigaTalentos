import { CldUploadWidget } from 'next-cloudinary';

export type UploadResult = {
  secure_url: string;
  public_id: string;
};

export const uploadPreset = "risemeup_talents";