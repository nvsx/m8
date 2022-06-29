import express from 'express'
const router = express.Router()

router.get('*', function(req,res) {
    // res.send("ok, not ready yet. ")
    res.render('m8/ce/feusers/index.ejs', {})
})
export default router

// import cePlugins from '../controllers/cePlugins.js'
// router.get('/create/', cePlugins.create)
// router.post('/createsave/', cePlugins.createsave)
// router.get('/read/', cePlugins.read)
// router.post('/update/', cePlugins.update)
// router.post('/delete/', cePlugins.delete)
// router.get('/', cePlugins.list)
// export default cePlugins
