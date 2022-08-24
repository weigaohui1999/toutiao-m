import request from '@/utils/request'

export const getArticles = (params) => {
  return request({
    method: 'get',
    url: '/articles',
    params
  })
}

export const getArticleById = (articleId) => {
  return request({
    method: 'get',
    url: '/articles/' + articleId
  })
}

export const delCollected = (target) => {
  return request({
    method: 'delete',
    url: '/articles/collections/' + target
  })
}

export const addCollected = (target) => {
  return request({
    method: 'post',
    url: '/articles/collections',
    data: {
      target
    }
  })
}

export const delLike = (target) => {
  return request({
    method: 'delete',
    url: '/articles/likings/' + target
  })
}

export const addLike = (target) => {
  return request({
    method: 'post',
    url: '/articles/likings',
    data: {
      target
    }
  })
}
