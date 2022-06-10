// import express from 'express'
// let app = express.Router()
// app.set('views', '../site/ejspages')
// app.set('layout', '../ejslayouts/default')

// import express from 'express'
// var app = express()
// app.set('views', 'ejspages')
// app.set('layout', 'ejslayouts/ce')

const ceController = {
  run: function (req, res) {
    // res.send("hello world m8ce")
    // app.set('layout', 'ejslayouts/ce')
    // let ejs_file = 'm8/ce.ejs'
    // res.render(ejs_file, {})
    let locals = {}
    locals.title = 'CE start page'
    res.render('m8/ce.ejs', locals)
    // console.log(req.layout)
    // res.sendStatus(200)
  },
  golist: function (req, res) {
    let locals = {}
    locals.title = 'generting pages'
    res.render('m8/ce.ejs', locals)
  }
}

export default ceController
