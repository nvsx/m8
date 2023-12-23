// import ejs               from 'ejs'
import express           from 'express'
import fs                from 'fs'
import path              from 'path'
import dotenv            from 'dotenv'
import { fileURLToPath } from 'url'
import bodyParser        from 'body-parser'

// config files
const env_file   = '../.env'
const version_file = './version.json'
const sitecfg_file = '../site/siteconfig.json'

// read config
const dotenv_result = dotenv.config({ path: env_file })
if (dotenv_result.error) { throw dotenv_result.error }
const site_raw = fs.readFileSync(sitecfg_file, "utf8")
const site_cfg = JSON.parse(site_raw)
const version_raw = fs.readFileSync(version_file, "utf8")
const m8info = JSON.parse(version_raw)
site_cfg.version = m8info.version

// global
const serverpath = fileURLToPath(import.meta.url)
global.__basedir = path.dirname(serverpath)
global.__context = process.env.NODE_ENV || 'undefined_node_env'
global.__m8info = m8info
global.__sitecfg = site_cfg
global.__dbfile = "../" + process.env.DATABASE

// app
const app = express()
app.use(express.static('../public'))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views',  ['./views', '../site/views'])
app.use(bodyParser.urlencoded({ extended: true }))

// routing
import router from './routes/index.js'
app.use(router)

const startServer = async () => {
  // db = await dbPromise
  // await db.migrate()
  let server = app.listen(process.env.PORT || 8080, () => {
    console.debug('\x1b[34mPort        :', server.address().port)
    console.debug('\x1b[34mNode        :', process.version)
    console.debug('m8version:', global.__m8info.version)
    console.debug('Context     :', global.__context)
    console.debug('Time        : ' + new Date().toLocaleString('zh-TW'))
    console.debug('BaseDir     :', __basedir)
    console.debug('VersionFile : ' + version_file)
    console.debug('EnvFile     : ' + env_file)
    console.debug('SitecfgFile : ' + sitecfg_file)
    console.debug('CE : http://127.0.0.1:' + server.address().port + '/_m8/ce')
    console.debug('\x1b[0m')
    // console.debug('SQLite  :', __basedir + '/' + process.env.DS_FILE, '\x1b[0m')
  })
}
startServer()
