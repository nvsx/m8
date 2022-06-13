import fs from 'fs'
import { Sequelize, Model, DataTypes } from 'sequelize';

// database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../db/start.db'
});
const Page = sequelize.define('pages', {
	id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
	parentid: DataTypes.INTEGER,
	status: DataTypes.INTEGER,
	layout: DataTypes.STRING,
	layout_current: DataTypes.STRING,
	title: DataTypes.STRING,
	description: DataTypes.STRING,
	notes: DataTypes.STRING,
	type: DataTypes.STRING,
	slug: DataTypes.STRING, 
	path: DataTypes.STRING,
	robots_index: DataTypes.INTEGER,
	robots_follow: DataTypes.INTEGER,
	in_sitemap: DataTypes.INTEGER,
	in_search: DataTypes.INTEGER,
	in_menu: DataTypes.INTEGER,
	link_target: DataTypes.STRING,
	caching: DataTypes.STRING,
	image: DataTypes.STRING,
	language: DataTypes.STRING,
	date_start: DataTypes.STRING,
	date_end: DataTypes.STRING,
	date_recurisve: DataTypes.INTEGER,
	categories: DataTypes.STRING, 
	tags: DataTypes.STRING,
});
const pages = await Page.findAll();

const output_dir = '../public'
const input_dir  = '../site/views'


const ceController = {
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ce: function (req, res) {
    let output_table = '<table>\n<tr><th>ID</th><th>Path</th><th>Title</th><th>Generate</th><th>Edit</th></tr>'
    for(let i=0; i<pages.length; i++) {
      // console.log(i)
      output_table = output_table + '\n\n<tr>'
      // output_table = output_table + '\n<td>'
      // output_table = output_table + pages.i['path']
      // output_table = output_table + JSON.stringify(pages[i])
      let thispage = pages[i]
      output_table = output_table + '\n<td>' + thispage.id + '</td>'
      output_table = output_table + '\n<td>'
      output_table = output_table + `<a href="${thispage.path}" target="localhost">${thispage.path}</a>`
      output_table = output_table + '</td>'
      output_table = output_table + '\n<td>' + thispage.title + '</td>'
      output_table = output_table + '<td>'
      output_table = output_table + `<a href="/m8/dbgen/?page=${thispage.path}" target="localhost">${thispage.path}</a>`
      output_table = output_table + '</td>'
      output_table = output_table + '<td>'
      output_table = output_table + `<a href="/m8/ce/page/?action=edit&id=${thispage.id}">${thispage.id}</a>`
      output_table = output_table + '</td>'
      output_table = output_table + '\n</tr>'
    }
    output_table = output_table + '\n\n</table>'
    // console.log(output_table)

    let locals = {}
    locals.title = 'List of pages'
    locals.body = output_table
    res.render('m8/ce.ejs', locals)
    // console.log(req.layout)
    // res.sendStatus(200)
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  staticgen: function (req, res) {
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
  dbgen: async function(req, res) {
    console.log(req.originalUrl)
    let myData = {}

    let page = req.query.page
    if( !page  ) { page = '' }
    let searchpath = page.replace(/\/+/g, '/')
    searchpath = searchpath.replace(/\/$/, '')
    if(searchpath === '') { searchpath = '/' }
    console.log("    search_path: _" + searchpath + '_')

    const result = await Page.findOne({ where: { path: searchpath } })
    if (result === null) {
      console.log('Not found!')
      res.sendStatus(404)
    } 
    else {
      let output_path = output_dir + page
      let html_file   = output_path + '/index.html'
      console.log("    output_path:", output_path)
      console.log("    html_file:", html_file)
      // make dir
      if (! fs.existsSync(output_path)) {
        console.log(`    Creating directory ${output_path}.`);
        fs.mkdirSync(output_path, { recursive: true });
      }
      // console.log(result instanceof Page); // true
      // console.log("id", result.id)
      // console.log("title", result.title)
      myData.title = result.title
      
      let output_table = '<table>\n<tr><th>id</th><th>path</th><th>title</th></tr>'
      output_table = output_table + '\n\n<tr>'
      output_table = output_table + '\n<td>' + result.id + '</td>'
      output_table = output_table + '\n<td>' + result.path + '</td>'
      output_table = output_table + '\n<td>' + result.title + '</td>'
      output_table = output_table + '\n</tr>'
      output_table = output_table + '\n\n</table>'
      
      // if ! ejs_file: -> error 404
      // 4. deliver file
      
      // --- 2 ---
      // read and set all data
      // use layout to generate html
      // -- SELECT * FROM m8_nodes WHERE full_path = req_path
      
      // --- 3 ---
      // if cache_mode === 1
      // generate a file and place it in public dir
      
      // --- 4 ---
      // send response
      // (1)
      // https://www4.example.com/articles?filter=something
      // console.log(req.protocol)     // "https"
      // console.log(req.hostname)     // "example.com"
      // console.log(req.path)         // "/articles"
      // console.log(req.originalUrl)  // "/articles?filter=something"
      // console.log(req.subdomains)   // "['www4']"
      // let locals = {
        //   title: 'title by generator ' + req_path,
        //   description: 'description by generator',
        //   header: 'Page Header by generator',
        //   text: 'Hello and welcome says the Generator!',
        //   date: new Date()
        // };
        myData.body = '<div class="sector"><div class="container">hello test generating from data' + output_table + '</div></div>'

        res.render('site/m8/layouts/default.ejs', myData, function(err, output) {
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
  }
}

export default ceController
