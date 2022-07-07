// navigationBuilder

const navigationBuilder = {
  build: function(list, options){
    if(options && options.withhome){
      console.log("Requested Naviagtion with HOME")
    }
    let result = []
    // FIRST element of list is us
    let counter = 1
    let current = list[0]
    result.push(current)
    let finished = false
    while(finished === false) {
      counter = counter +1
      let searcher = 0
      while(searcher < list.length) {
        let tester = list[searcher]
        console.log(tester.id, " - ", current.parentid)
        if(tester.id == current.parentid) {
          current = tester
          // 2. push element
          result.push(current)
          break
        }
        searcher = searcher +1
      }
      if(current.parentid === 0 || current.parentid === '') {
        finished = true
      }
      // security switch:
      if(counter > 19) { finished = true }
    }
    // console.log(result)
    return result.reverse()
  }
}

export default navigationBuilder
