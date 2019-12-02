import io from 'socket.io-client'
import {url} from '../secrets'

const socket = io(url);

export default socket