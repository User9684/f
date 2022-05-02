import init from './modules/handlerStartup'

const client = await init(process.env.token, './commands');
export {client}