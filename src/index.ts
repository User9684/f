import {init} from './modules/handlerStartup'

const client = init(process.env.token, './commands');
export {client}