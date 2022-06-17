// import { resolveInclude } from 'ejs'
import User from '../models/User.js'
import path from 'path'
import fs from 'fs'

let ce_template = 'm8/ce/users/index.ejs'

const ceUsers = {

  list: function (req, res) {
    // GET list
    let locals = {}
    locals.title = 'BE Users'
    locals.content = '<!-- +++ list of backend users +++ -->'
    User.findAll().then(all_users => {
      locals.all_users = all_users
      res.render(ce_template, locals)
    })
  }
}

export default ceUsers
