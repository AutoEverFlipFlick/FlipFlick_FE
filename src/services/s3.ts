import axiosInstance from '../services/axiosInstance'

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axiosInstance.post('/s3/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return res.data.data // 반환된 S3 이미지 URL
}

export const deleteImage = async (imageUrl: string) => {
  return await axiosInstance.delete('/s3/image', {
    data: { url: imageUrl }, // ⚠️ 서버에서 JSON body로 받게 설정
  })
}
