import fs from 'fs'

// import express from 'express'
// let app = express.Router()
// app.set('views', '../site/ejspages')
// app.set('layout', '../ejslayouts/default')

// import express from 'express'
// var app = express()
// app.set('views', 'ejspages')
// app.set('layout', 'ejslayouts/ce')

const output_dir = '../public'
const input_dir  = '../site/views'

const ceController = {
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ce: function (req, res) {
    let locals = {}
    locals.title = 'CE start page'
    res.render('m8/ce.ejs', locals)
    // console.log(req.layout)
    // res.sendStatus(200)
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  staticgen: function (req, res) {
    console.log(req.originalUrl)
    let page = req.query.page
    if(!page || page === '' ) {
      console.log("    missing page parameter")
      res.sendStatus(404)
    }
    else {
      console.log("    page:        " + page)
      let input_path  = input_dir + page
      let output_path = output_dir + page
      let input_file  = input_path + 'index.ejs'
      let output_file = output_path + 'index.html'
      console.log("    input_file: ", input_file)
      console.log("    output_file:", output_file)

      if (! fs.existsSync(input_file)) {
        // ejs_file not found
        console.log("    ---> this is 404")
        res.sendStatus(404)
      }
      else {
        // make dir
        if (! fs.existsSync(output_path)) {
          console.log(`    Creating directory ${output_path}.`);
          fs.mkdirSync(output_path, { recursive: true });
        }
        // respond and save
        res.render(input_file, {}, function(err, output) {
          res.send(output)
          if (err) {
            console.error(err);
          }
          fs.writeFile(output_file, output, err => {
            console.log("    writing to file", output_file)
            if (err) {
              console.error(err);
            }
          })
        })
      }
    }
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  cdtest: function(req, res) {
    //res.sendStatus(200)

    // if ! ejs_file: -> error 404
    // 4. deliver file

    // --- 2 ---
    // read and set all data
    // use layout to generate html
    // -- SELECT * FROM m8_nodes WHERE full_path = req_path

    // --- 3 ---
    // if cache_mode === 1
    // generate a file and place it in public dir

    // --- 4 ---
    // send response
    // (1)
    // https://www4.example.com/articles?filter=something
    // console.log(req.protocol)     // "https"
    // console.log(req.hostname)     // "example.com"
    // console.log(req.path)         // "/articles"
    // console.log(req.originalUrl)  // "/articles?filter=something"
    // console.log(req.subdomains)   // "['www4']"
    // let locals = {
    //   title: 'title by generator ' + req_path,
    //   description: 'description by generator',
    //   header: 'Page Header by generator',
    //   text: 'Hello and welcome says the Generator!',
    //   date: new Date()
    // };
    let locals = {}
    locals.title = "cD test 33"
    locals.body = '<div class="sector"><div class="container">hello test generating from data</div></div>'
    res.render('site/m8/layouts/default.ejs', locals)
  }
}

export default ceController
