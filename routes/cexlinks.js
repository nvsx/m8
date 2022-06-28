import express from 'express'
const router = express.Router()

import ceXlinks from '../controllers/ceXlinks.js'

// router.get('/create/', ceXlinks.create)
// router.post('/createsave/', ceXlinks.createsave)
// router.get('/read/', ceXlinks.read)
// router.post('/update/', ceXlinks.update)
// router.post('/delete/', ceXlinks.delete)
router.get('/', ceXlinks.list)

export default router
