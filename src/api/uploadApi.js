import client from './client.js';

/**
 * Upload an image.
 * @param {File} file - The image file
 * @param {string} type - 'avatar' | 'cover' | 'post'
 */
export const uploadImage = async (file, type) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);

  const response = await client.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};
