import request from '@/utils/request'

export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/channels'
  })
}

export const addUserChannel = (channels) => {
  return request({
    method: 'patch',
    url: '/user/channels',
    data: {
      channels
    }
  })
}

export const delUserChannel = (channelId) => {
  return request({
    method: 'delete',
    url: '/user/channels/' + channelId
  })
}
