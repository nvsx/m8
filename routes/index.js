import express from 'express'
const router = express.Router()

// Named exports:
// module.exports.name = "something"
// Default exports:
// export default myfunction

router.get('/test/123', (req, res) => { res.redirect('/') })

// generator
import generatorRouter from './generator.js'
router.use(generatorRouter)

export default router
