import express from 'express'
const router = express.Router()

import cePluginController from '../controllers/cePluginController.js'

router.get('/', cePluginController.list)
// import cePlugins from '../controllers/cePlugins.js'
// router.get('/_m8/ce/plugins/create/', cePlugins.create)
// router.post('/_m8/ce/plugins/createsave/', cePlugins.createsave)
// router.get('/_m8/ce/plugins/read/', cePlugins.read)
// router.post('/_m8/ce/plugins/update/', cePlugins.update)
// router.post('/_m8/ce/plugins/delete/', cePlugins.delete)
// router.get('/_m8/ce/plugins/', cePlugins.list)
// export default cePlugins

export default router
