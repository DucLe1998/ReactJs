import { showError } from '../../utils/toast-utils';

const maxChunkFileSize = 5;
const minWidthImage = 1000;
const minHeightImage = 1000;

export async function validateFileType(e) {
  const fileName = e?.name;
  const type = fileName.substr(fileName.lastIndexOf('.') + 1);
  const trueType = /(jpeg|gif|png|jpg|tiff|bmp)$/gi.test(type);
  if (!trueType) {
    showError('Ảnh không đúng định dạng .jpeg, .gif, .png, .jpg, .tiff, .bmp');
  }
  return trueType;
}

export async function validateFileSize(e) {
  return true;
  const { URL } = window;
  const img = new Image();
  img.onload = () => {
    const w = img?.width;
    const h = img?.height;
    const trueSize = w >= minWidthImage ? h >= minHeightImage : false;
    if (!trueSize) {
      showError(
        `Ảnh có kích thước tối thiểu rộng ${minWidthImage}, dài ${minHeightImage}!`,
      );
    }
    return trueSize;
  };
  img.src = URL.createObjectURL(e);
  const a = await img.onload();
  return a;
}

export async function validateFileChunkSize(e) {
  const trueFileChunkSize = Number(e?.size) < maxChunkFileSize * 1024 * 1024;
  if (!trueFileChunkSize) {
    showError(`Ảnh có kích thước không vượt quá ${maxChunkFileSize} Mb`);
  }
  return trueFileChunkSize;
}
