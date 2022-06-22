import Element from '../models/Element.js'
import path from 'path'
import fs from 'fs'

let ce_template = 'm8/ce/elements/index.ejs'

const ceElements = {

  list: function (req, res) {
    let locals = {}
    locals.nav_active_elements = 'active'
    locals.title = 'Elements'
    locals.content = '<!-- +++ list of elements +++ -->'
    Element.findAll({
      order: [
        ['id', 'ASC']
    ],
    }).then(all_elements => {
      locals.all_elements = all_elements
      res.render(ce_template, locals)
    })
  },
}

export default ceElements
