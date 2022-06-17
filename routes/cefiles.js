import express from 'express'
const router = express.Router()

import ceFiles from '../controllers/ceFiles.js'

// router.get('/m8/ce/files/create/', ceFiles.create)
// router.post('/m8/ce/files/createsave/', ceFiles.createsave)
// router.get('/m8/ce/files/read/', ceFiles.read)
// router.post('/m8/ce/files/update/', ceFiles.update)
// router.post('/m8/ce/files/delete/', ceFiles.delete)
router.get('/m8/ce/files/', ceFiles.list)

export default router
