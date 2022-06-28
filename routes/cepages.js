import express from 'express'
const router = express.Router()

import cePages from '../controllers/cePages.js'

router.get('/_m8/ce/pages/create/', cePages.create)
router.post('/_m8/ce/pages/createsave/', cePages.createsave)
router.get('/_m8/ce/pages/read/', cePages.read)
router.post('/_m8/ce/pages/update/', cePages.update)
router.post('/_m8/ce/pages/delete/', cePages.delete)
router.get('/_m8/ce/pages/', cePages.list)

export default router
