import fs      from 'fs'
import Node    from '../models/Node.js'
import Article from '../models/Article.js'

const input_dir    = '../site/views'
const output_dir   = '../public'
const ejs_template = 'site/m8/layouts/default.ejs'

const generator = {

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  generate: function (req, res) {
    const req_path = req.path
    let searchpath = req_path.replace(/\/+/g, '/')
    // file or dir?
    const slashRegex = /\/$/g
    const slashEnd   = searchpath.match(slashRegex)

    console.log("GENERATOR GENERATE")
    console.log('    path', searchpath)

    // ----------------------------------------------------
    // index.html is redirectd to slash:
    const regex1 = /\/index\.html$/g
    const found1 = req_path.match(regex1)
    if(found1) {
      let redirect_path = ''
      console.log("    REQUESTED an INDEX")
      redirect_path = req_path.replace(regex1, '/')
      console.log("    NEW REDIRECT PATH", redirect_path)
      res.redirect(redirect_path)
      return
    }
    // no more redirect to / without index.html, because files do not have slash
    // else {
    //   const regex2 = /\/$/g
    //   const found2 = req_path.match(regex2)
    //   if(! found2) {
    //     redirect_path = req_path + '/'
    //   }
    // }
    // ----------------------------------------------------
    // Check type, we have three:
    // view, node, article
    let resource_type = ''
    let suffix = '.ejs'
    if(slashEnd) { suffix = 'index.ejs'}
    let source_ejs = input_dir + searchpath + suffix
    let source_node, source_article
    console.log("    TEST ejs_file:", source_ejs)
    if (fs.existsSync(source_ejs)) {
      resource_type = 'view'
      console.log("resource_type === view")
      let output_file  = output_dir + searchpath
      let generate_dir = output_dir + searchpath
      if(slashEnd) {
        output_file = output_file + 'index.html'
      }
      else {
        // generate_dir
        // need to remove last part from generate_dir, because this is file
        let path_array = generate_dir.split("/")
        let create_dir = generate_dir.slice(0,-1).join('/')
        console.log("    create_dir", create_dir)
        if (! fs.existsSync(create_dir)) {
          console.log(`    Creating directory ${create_dir}.`);
          fs.mkdirSync(create_dir, { recursive: true });
        }
      }
      console.log("    source_ejs:   " + source_ejs)
      console.log("    generate_dir: " + generate_dir)
      console.log("    output_file:  " + output_file)
      // mkdir
      if (! fs.existsSync(generate_dir)) {
        console.log(`    Directory ${generate_dir} not found. Try to create...`);
        fs.mkdirSync(generate_dir, { recursive: true });
      }
      // 4. Respond and save file
      res.render(source_ejs, {}, function(err, output) {
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
      // res.sendStatus(200)
    }
    else {
      console.log("    TESTing for node")
      Node.findOne({ where: { path: searchpath } }).then(noderesult => {
        if(noderesult){
          source_node = noderesult
          resource_type = 'node'
          console.log("resource_type === node")
          res.sendStatus(200)
        } else {
          console.log("    testing for article")
          Article.findOne({ where: { path: searchpath } }).then(articleresult => {
            if(articleresult) {
              source_article = articleresult
              resource_type = 'article'
              console.log("resource_type === node")
              res.sendStatus(200)
            } 
            else {
              // no match of any kind
              console.log('    ERROR: Resource not found.')
              res.sendStatus(404)
              return
            }
          })
        }
      })
    }
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  gen_view: function (req, res) {
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
  gen_node: async function(req, res) {
    console.log("----------------------")
    console.log("GENERATE NODE")
    console.log(req.originalUrl)

    let myData = {}
    let node = req.query.path
    if( !node ) { node = '' }
    let searchpath = node.replace(/\/+/g, '/')
    searchpath = searchpath.replace(/\/$/, '')
    if(searchpath === '') { searchpath = '/' }
    console.log('    search_path: [' + searchpath + ']')

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
      res.render(ejs_template, myData, function(err, output) {
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
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  gen_article: async function(req, res) {
    console.log("----------------------")
    console.log("GENERATE ARTICLE")
    console.log(req.originalUrl)

    let myData = {}
    let article_path = req.query.path
    if( !article_path ) { article_path = '' }
    // replace duplicate slashes:
    let searchpath = article_path.replace(/\/+/g, '/')
    // no trailing slash:
    searchpath = searchpath.replace(/\/$/, '')
    if(searchpath === '') { searchpath = '/' }
    console.log("    search_path: [" + searchpath + ']')
    const result = await Article.findOne({ where: { path: searchpath } })
    if (result === null) {
      console.log('Not found!')
      res.sendStatus(404)
    } 
    else {
      let path_array = searchpath.split("/")
      //let path_length = path_array.length
      let article_dir = output_dir + path_array.slice(0,-1).join('/')
      console.log("    article_dir", article_dir)
      if (! fs.existsSync(article_dir)) {
        console.log(`    Creating directory ${article_dir}.`);
        fs.mkdirSync(article_dir, { recursive: true });
      }

      let html_file = output_dir + article_path
      console.log("    html_file:", html_file)

      myData.title = result.title
      myData.content = result.content
      res.render(ejs_template, myData, function(err, output) {
        res.sendStatus(200)
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

export default generator
