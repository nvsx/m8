// ceConfigurationController
import path from 'path'
import fs from 'fs'

let ce_template = 'm8/ce/configuration/index.ejs'
let siteconfiguration_file = '../site/siteconfig.json'
let version_file = 'version.json'

const ceConfiguration = {
  list: function (req, res) {
    // GET list
    let content = ''
    let locals = {}

    fs.readFile(siteconfiguration_file, "utf8", (err, data) => {
      if(err) {
        res.sendStatus(500)
      }
      else {
        let file_raw = data
        let config_obj = JSON.parse(file_raw)
        content = content + '<pre>' + JSON.stringify(config_obj, null, 4)
        content = content + '</pre><br><br>'
        fs.readFile(version_file, "utf8", (err, version_data) => {
          if(err) {
            res.sendStatus(500)
          }
          else {
            let version_obj = JSON.parse(version_data)
            content = content + '<pre>'
            content = content + JSON.stringify(version_obj, null, 4)
            content = content + '</pre>'
            locals.content = content
            res.render(ce_template, locals)
          }
        })
      }
    })
  }

}

export default ceConfiguration
