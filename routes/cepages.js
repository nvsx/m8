import express from 'express'
const router = express.Router()

import cePages from '../controllers/cePages.js'

// router.get('/m8/ce/pages/', cePages.run)
router.get('/m8/ce/pages/create/', cePages.create)
router.post('/m8/ce/pages/createsave/', cePages.createsave)
router.get('/m8/ce/pages/read/', cePages.read)
router.post('/m8/ce/pages/update/', cePages.update)
router.post('/m8/ce/pages/delete/', cePages.delete)
router.get('/m8/ce/pages/', cePages.list)

export default router
