import express from 'express'
const router = express.Router()

import ceUsers from '../controllers/ceUsers.js'

// router.get('/_m8/ce/users/create/', ceUsers.create)
// router.post('/_m8/ce/users/createsave/', ceUsers.createsave)
// router.get('/_m8/ce/users/read/', ceUsers.read)
// router.post('/_m8/ce/users/update/', ceUsers.update)
// router.post('/_m8/ce/users/delete/', ceUsers.delete)
router.get('/_m8/ce/users/', ceUsers.list)

export default router
