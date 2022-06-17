import express from 'express'
const router = express.Router()

import ceUsers from '../controllers/ceUsers.js'

// router.get('/m8/ce/users/create/', ceUsers.create)
// router.post('/m8/ce/users/createsave/', ceUsers.createsave)
// router.get('/m8/ce/users/read/', ceUsers.read)
// router.post('/m8/ce/users/update/', ceUsers.update)
// router.post('/m8/ce/users/delete/', ceUsers.delete)
router.get('/m8/ce/users/', ceUsers.list)

export default router
