// import { resolveInclude } from 'ejs'
import path from 'path'
import fs from 'fs'

const primary_ext_dir = '../ext'
const public_ext_dir = '../public/ext'
let ce_template = 'm8/ce/plugins/index.ejs'

const cePluginController = {
  list: function (req, res) {
    let locals = {}
    locals.nav_active_plugins = 'active'
    locals.title = 'List of plugins'
    locals.content = '<!-- +++ list of plugins +++ -->'
    locals.plugin_list = []
    fs.readdir(primary_ext_dir, (err, files) => {
      if(files.length) {
        locals.counter = files.length
        let i = 0
        while( i < files.length ) {
          let thisFile = {}
          let thisName = files[i]
          let thisInfo = {}
          let thisFileFullPath = primary_ext_dir + '/' + thisName
          let fileData = fs.statSync( thisFileFullPath, {} )
          if( fileData ) {
            thisInfo = fileData
          }
          thisFile.name = thisName
          thisFile.info = thisInfo
          locals.plugin_list.push(thisFile)  
          i = i +1
        }
      }
      res.render(ce_template, locals)
    })
  }
}

export default cePluginController
