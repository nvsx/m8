import express from 'express'
const router = express.Router()

// Named exports:
// module.exports.name = "something"
// Default exports:
// export default myfunction
// router.get('/test/123', (req, res) => { res.redirect('/') })

// /_m8/ce/nodes/
import cenodesRouter from './cenodes.js'
router.use('/_m8/ce/nodes/', cenodesRouter)

// /_m8/ce/containers/
import cecontainersRouter from './cecontainers.js'
router.use('/_m8/ce/containers/', cecontainersRouter)

// /_m8/ce/pages/
import cePagesRouter from './cepages.js'
router.use(cePagesRouter)

// /_m8/ce/articles/
import ceArticlesRouter from './cearticles.js'
router.use(ceArticlesRouter)

// /_m8/ce/shortcuts/
import ceShortcutRouter from './ceshortcuts.js'
router.use('/_m8/ce/shortcuts/', ceShortcutRouter)

// /_m8/ce/xlinks/
import ceXlinkRouter from './cexlinks.js'
router.use('/_m8/ce/xlinks/', ceXlinkRouter)

// /_m8/ce/elements/
import ceElementRouter from './ceelements.js'
router.use(ceElementRouter)

// /_m8/ce/files/
import cefilesRouter from './cefiles.js'
router.use(cefilesRouter)

// /_m8/ce/users/
import cepluginsRouter from './ceplugins.js'
router.use('/_m8/ce/ceplugins/', cepluginsRouter)

// /_m8/ce/feusers/
import cefeusersRouter from './cefeusers.js'
router.use('/_m8/ce/cefeusers/', cefeusersRouter)

// /_m8/ce/users/
import ceusersRouter from './ceusers.js'
router.use(ceusersRouter)

// /_m8/ce/
import ceRouter from './ce.js'
router.use('/_m8/ce/', ceRouter)

// fallback all URLs: generator
import generatorRouter from './generator.js'
router.use(generatorRouter)

export default router
