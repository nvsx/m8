import fs from 'fs'

const output_dir = '../public'
const input_dir = '../site/views'

const generator = {
  generate: function (req, res) {
    const req_path = req.path
    console.log(req_path)

    // -----------------------------------------
    // 1. build redirect?
    let redirect_path = ''

    const regex1 = /\/index\.html$/g
    const found1 = req_path.match(regex1)
    if(found1) {
      console.log("    FOUND an INDEX")
      redirect_path = req_path.replace(regex1, '/')
      console.log("    NEW REDIRECT PATH", redirect_path)
    }
    else {
      const regex2 = /\/$/g
      const found2 = req_path.match(regex2)
      if(! found2) {
        redirect_path = req_path + '/'
      }
    }

    // -----------------------------------------
    // 2. redirect or file
    if( redirect_path !== '') {
      console.log("  redirect_to", redirect_path)
      res.redirect(redirect_path)
    }
    else {
      let file_path = output_dir + req_path
      let html_file = file_path + 'index.html'
      const rxa = /\/$/
      let file_dir = file_path.replace(rxa, '')

      console.log("    file_dir: " + file_dir)
      console.log("    file_path: " + file_path)
      console.log("    html_file: " + html_file)

      let ejs_file = input_dir + req_path + 'index.ejs'
      const rx = /^\//
      ejs_file = ejs_file.replace(rx, '')
      console.log("    ejs_file: " + ejs_file)

      if (! fs.existsSync(file_dir)) {
        console.log(`    Directory ${file_dir} not found.`);
        fs.mkdirSync(file_dir, { recursive: true });
      }

      // -----------------------------------------
      // 3. 404
      if (! fs.existsSync(ejs_file)) {
        console.log("    ---> this is 404")
        res.sendStatus(404)
      }
      else {

        // -----------------------------------------
        // 4. Respond and save file
        res.render(ejs_file, {}, function(err, output) {
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
}

export default generator
