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
    locals.nav_active_start = 'active'
    locals.title = 'CE: Start'
    locals.content = 'Welcome to the m8 backend!'
    res.render(ce_template, locals)
    // console.log(req.layout)
    // res.sendStatus(200)
  }
  
}

export default ceController
