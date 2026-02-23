import { http } from '@/services/http'

export const importMembers = (file, mode = 'dry-run') => {
  const fd = new FormData()
  fd.append('file', file)

  return http.post(
    '/admin/members/import',
    {
      data: fd,
      params: { mode },
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  ).then(r => r.data)
}
