// pathSanitizer

const pathSanitizer = {
  sanitize: function(path, type){
    let newPath = path
    if(! newPath || newPath === '') {
      newPath = '_'
    }
    // no whitespaces
    newPath = newPath.replace(/\s/g, '_')
    // replace more than one slashslash with slash
    newPath = newPath.replace(/\/+/g, '/')
    // always start with slash
    newPath = newPath.replace(/^\//, '')
    newPath = '/' + newPath
    // ending
    if(type === 'article' ) {
      // article ending always with \.html
      newPath = newPath.replace(/\/$/, '')
      newPath = newPath.replace(/\.html$/, '')
      newPath = newPath + '.html'
    }
    else {
      // everything else ending always with /
      newPath = newPath.replace(/\/$/, '')
      newPath = newPath + '/'
    }
    // const slashRegex = /\/$/g
    // const htmlRegex  = /\.html$/g
    // const slashEnd   = searchpath.match(slashRegex)? true : false
    // const htmlEnd    = searchpath.match(htmlRegex)? true :false
    return newPath
  }
}

export default pathSanitizer
