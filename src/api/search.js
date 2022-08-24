import request from '@/utils/request'

export const getSearchSuggestion = q => {
  return request({
    method: 'get',
    url: '/suggestion',
    params: {
      q
    }
  })
}

export const getSearchResult = params => {
  return request({
    method: 'get',
    url: '/search',
    params
  })
}
