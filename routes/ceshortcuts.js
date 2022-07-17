import express from 'express'
const router = express.Router()

import ceShortcuts from '../controllers/ceShortcuts.js'

// router.get('/create/', ceShortcuts.create)
// router.post('/createsave/', ceShortcuts.createsave)
router.get('/edit/', ceShortcuts.edit)
// router.post('/update/', ceShortcuts.update)
// router.post('/delete/', ceShortcuts.delete)
router.get('/', ceShortcuts.list)

export default router
