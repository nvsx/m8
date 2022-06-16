import express from 'express'
const router = express.Router()

// Named exports:
// module.exports.name = "something"
// Default exports:
// export default myfunction

// router.get('/test/123', (req, res) => { res.redirect('/') })

// m8/ce/pages/
import cepagesRouter from './cepages.js'
router.use(cepagesRouter)
// m8/ce/
import ceRouter from './ce.js'
router.use(ceRouter)

// fallback all URLs: generator
import generatorRouter from './generator.js'
router.use(generatorRouter)

export default router
