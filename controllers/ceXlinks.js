import Xlink from '../models/Xlink.js'
import axios from 'axios'
import getNodes from './helpers/get_nodes.js'
import Element2Node from '../models/Element2Node.js'
import File from '../models/File.js'
import path from 'path'
import fs from 'fs'

const public_dir = '../public'
let ce_template = 'm8/ce/index.ejs'
let url_prefix = '/_m8/files/'
let dir_prefix = '../files/'

const ceXlinks = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/xlinks/index.ejs'
    let locals = {}
    locals.nav_active_xlinks = 'active'
    locals.title = 'List of files'
    locals.content = '<!-- +++ list of files +++ -->'
    locals.url_prefix = url_prefix
    locals.dir_prefix = dir_prefix
    Xlink.findAll().then(all_xlinks => {
      locals.all_xlinks = all_xlinks
      res.render(ce_template, locals)
    })
  }
}

export default ceXlinks
