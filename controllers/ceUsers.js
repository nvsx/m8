// import { resolveInclude } from 'ejs'
import User from '../models/User.js'
import path from 'path'
import fs from 'fs'

let ce_template = 'm8/ce/users/index.ejs'

const ceUsers = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/users/index.ejs'
    let locals = {}
    locals.nav_active_users = 'active'
    locals.title = 'BE Users'
    locals.content = '<!-- +++ list of users +++ -->'
    User.findAll({
      order: [
        ['loginname', 'ASC']
    ],
    }).then(all_users => {
      locals.all_users = all_users
      res.render(ce_template, locals)
    })
  },
}

export default ceUsers
