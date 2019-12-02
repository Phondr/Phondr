import {createStore, applyMiddleware, compose} from 'redux'
import axios from 'axios'
import appReducer from '.'
import {createLogger} from 'redux-logger'
import {composeWithDevTools} from 'remote-redux-devtools'
import thunkMiddleware from 'redux-thunk'

let middleware = [
  thunkMiddleware.withExtraArgument({axios}),
  createLogger({collapsed: true})
]
// if (process.browser) {
//   middleware = [...middleware, createLogger({ collapsed: true })]
// }

const RESET_STORE = 'RESET_STORE'
export const resetStore = () => ({type: RESET_STORE})
const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined
    return appReducer(state, action)
  }
  return appReducer(state, action)
}
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose
export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
)
