import {createRebirthPass} from './api.js'

export const routes = {
  '/passes': {
    method: 'post',
    fn: createRebirthPass
  },
}
