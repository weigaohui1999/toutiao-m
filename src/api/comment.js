import request from '@/utils/request'

export const gettComment = (params) => {
  return request({
    method: 'get',
    url: '/comments',
    params
  })
}

export const addCommentLike = (target) => {
  return request({
    method: 'post',
    url: '/comment/likings',
    data: {
      target
    }
  })
}

export const delCommentLike = (target) => {
  return request({
    method: 'delete',
    url: '/comment/likings/' + target
  })
}

export const addComment = (data) => {
  return request({
    method: 'post',
    url: '/comments',
    data
  })
}
