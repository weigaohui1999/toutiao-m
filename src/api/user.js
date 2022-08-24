import request from '@/utils/request'
// import store from '@/store'

export const login = (data) => {
  return request({
    method: 'post',
    url: '/authorizations',
    data
  })
}

export const getSmsCode = (mobile) => {
  return request({
    method: 'get',
    url: '/sms/codes/' + mobile
  })
}

export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/user'
    // headers: {
    //   // 需要授权发送请求头携带token信息才能回去用户信息
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/user/channels'
  })
}

export const addFollow = (target) => {
  return request({
    method: 'post',
    url: '/user/followings',
    data: {
      target
    }
  })
}

export const deleteFollow = (target) => {
  return request({
    method: 'delete',
    url: '/user/followings/' + target
  })
}

export const getUserProfile = () => {
  return request({
    method: 'get',
    url: '/user/profile'
  })
}

export const updateUserProfile = (data) => {
  return request({
    method: 'patch',
    url: '/user/profile'
  })
}

export const updateUserPhotoImg = (data) => {
  return request({
    method: 'patch',
    url: '/user/photo',
    data
  })
}
