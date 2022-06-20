// import { resolveInclude } from 'ejs'
import User from '../models/User.js'
import path from 'path'
import fs from 'fs'

let ce_template = 'm8/ce/users/index.ejs'

const ceUsers = {

  list: function (req, res) {
    // GET list
    let users_list = [
      {
        id: 1,
        loginname: "admin"
      },
      {
        id: 2,
        loginname: "test"
      }
    ]
    let locals = {}
    locals.nav_active_users = 'active'
    locals.title = 'BE Users'
    locals.content = '<!-- +++ list of backend users +++ -->'
    User.findAll().then(all_users => {
      // locals.all_users = all_users
      locals.all_users = users_list
      res.render(ce_template, locals)
    })
  }
}

export default ceUsers
