import fs from 'fs'
// import { Sequelize, Model, DataTypes } from 'sequelize'
// import sequelize from '../modules/database.js'
import Node from '../models/Node.js'

const output_dir = '../public'
const input_dir  = '../site/views'
const ce_template = 'm8/ce/index.ejs'
const node_template = 'site/m8/layouts/default.ejs'

const ceController = {
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ce: function (req, res) {
    let locals = {}
    locals.title = 'CE: Start'
    locals.content = 'Welcome here!'
    res.render(ce_template, locals)
    // console.log(req.layout)
    // res.sendStatus(200)
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  staticgen: function (req, res) {
    console.log(req.originalUrl)
    let page = req.query.page
    if(!page || page === '' ) {
      console.log("    missing parameter page")
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
  dbgen: async function(req, res) {
    console.log(req.originalUrl)
    let myData = {}

    let node = req.query.node
    if( !node ) { node = '' }
    let searchpath = node.replace(/\/+/g, '/')
    searchpath = searchpath.replace(/\/$/, '')
    if(searchpath === '') { searchpath = '/' }
    console.log("    search_path: _" + searchpath + '_')

    const result = await Node.findOne({ where: { path: searchpath } })
    if (result === null) {
      console.log('Not found!')
      res.sendStatus(404)
    } 
    else {
      let output_path = output_dir + node
      let html_file   = output_path + '/index.html'
      console.log("    output_path:", output_path)
      console.log("    html_file:", html_file)
      // make dir
      if (! fs.existsSync(output_path)) {
        console.log(`    Creating directory ${output_path}.`);
        fs.mkdirSync(output_path, { recursive: true });
      }
      myData.title = result.title
      myData.content = result.content
      // myData.content = '<div class="sector"><div class="container">' + output_table + '</div></div>'
      res.render(node_template, myData, function(err, output) {
        res.send(output)
        if (err) {
          console.error(err);
        }
        fs.writeFile(html_file, output, err => {
          console.log("    writing to file", html_file)
          if (err) {
            console.error(err);
          }
        })
      })
    }
  }
}

export default ceController
