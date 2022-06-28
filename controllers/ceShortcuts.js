import File from '../models/File.js'
import path from 'path'
import fs from 'fs'

const public_dir = '../public'
let ce_template = 'm8/ce/index.ejs'
let url_prefix = '/_m8/files/'
let dir_prefix = '../files/'

const ceShortcuts = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/shortcuts/index.ejs'
    let locals = {}
    locals.nav_active_shortcuts = 'active'
    locals.title = 'List of files'
    locals.content = '<!-- +++ list of files +++ -->'
    locals.url_prefix = url_prefix
    locals.dir_prefix = dir_prefix
    File.findAll().then(all_files => {
      locals.all_files = all_files
      res.render(ce_template, locals)
    })
  }
}

export default ceShortcuts
