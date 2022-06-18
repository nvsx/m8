import express from 'express'
const router = express.Router()

// Named exports:
// module.exports.name = "something"
// Default exports:
// export default myfunction
// router.get('/test/123', (req, res) => { res.redirect('/') })

// m8/ce/articles/
import ceArticlesRouter from './cearticles.js'
router.use(ceArticlesRouter)

// m8/ce/files/
import cefilesRouter from './cefiles.js'
router.use(cefilesRouter)

// /m8/ce/pages/
import cenodesRouter from './cenodes.js'
router.use(cenodesRouter)

// /m8/ce/users/
import ceusersRouter from './ceusers.js'
router.use(ceusersRouter)

// /m8/ce/
import ceRouter from './ce.js'
router.use(ceRouter)

// fallback all URLs: generator
import generatorRouter from './generator.js'
router.use(generatorRouter)

export default router
