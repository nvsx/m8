// import ejs               from 'ejs'
import express           from 'express'
import path              from 'path'
import dotenv            from 'dotenv'
import { fileURLToPath } from 'url'
import bodyParser        from 'body-parser'

// config
const env_file   = '../.env'
const dotenv_result = dotenv.config({ path: env_file })
if (dotenv_result.error) { throw dotenv_result.error }

// global
const serverpath = fileURLToPath(import.meta.url)
global.__basedir = path.dirname(serverpath)
global.__context = process.env.NODE_ENV || 'undefined_context'
global.__m8version = 'v0.0.4'

// app
const app = express()
app.use(express.static('../public'))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views','../views');
app.use(bodyParser.urlencoded({ extended: true }));

// routing
import router from './routes/index.js'
app.use(router)

const startServer = async () => {
  // db = await dbPromise
  // await db.migrate()
  let server = app.listen(process.env.PORT || 8088, () => {
    console.debug('\x1b[34mPort     :', server.address().port)
    console.debug('\x1b[34mNode     :', process.version)
    console.debug('m8version:', global.__m8version)
    console.debug('Context  :', global.__context)
    console.debug('Time     : ' + new Date().toLocaleString('zh-TW'))
    console.debug('BaseDir  :', __basedir)
    console.debug('EnvFile  : ' + env_file)
    console.debug('CfgDir   : ' + process.env["NODE_CONFIG_DIR"])
    console.debug('Database : ' + process.env["DATABASE"])
    console.debug('SQLite  :', __basedir + '/' + process.env.DS_FILE, '\x1b[0m')
  })
}
startServer()
