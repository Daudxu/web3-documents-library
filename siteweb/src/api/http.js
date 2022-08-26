import axios from 'axios'
// import qs from 'qs'
import { BASE_API, BASE_API_KEY } from '../config/setting'
const instance = axios.create({
  baseURL: BASE_API,
  timeout: 1 * 60 * 1000
})

instance.interceptors.request.use((request) => {
  request.headers = {
    "Accept": "application/json",
    "X-API-Key": BASE_API_KEY,
  }
  return request
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response.data
}, error => {
  const { response } = error
  errorHandle(response.status)
  return Promise.reject(error)
})

const errorHandle = (status) => {
  var statusMessage = null
  switch (status) {
    case 400:
      statusMessage = 'error: code 400'
      break
    case 401:
      statusMessage = 'error: code 401'
      break
    case 403:
      statusMessage = 'error: code 403'
      break
    case 404:
      statusMessage = 'error: code 404'
      break
    case 500:
      statusMessage = 'error: code 500'
      break
    case 504:
      statusMessage = 'error: code 504'
      break
    default:
      console.log('other error: code ', status)
  }
  return Promise.reject(statusMessage)
}

const api = {
  get (url, data = null, headers = null) {
    return instance.get(url, { params: data, headers: headers })
  },

  post (url, data = null, headers = null) {
    return instance.post(url, data, headers)
  }
}

export { api }
