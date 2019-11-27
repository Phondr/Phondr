import axios from 'axios'
import { url } from '../secrets'

export default axios.create({
  baseURL: `${url}/graphql`,
})

//   headers: {
//     Authorization: 'Bearer 8Ea_wA4Ce_hVR-TIg48WIJSpJsEtJXs03ptkSU8gvTV1ryo7N2IQo_u9G_rov2t4-2AZAhZmKpmkYVChGJ5iqE891kij1BbE2kDgqfPXv9IQKYEfteNZeX6DB9C5XXYx',
//   },
