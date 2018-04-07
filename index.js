let postData = []
let authorData = []
let allData = []
let pageList = []
let defaultCurrentPage = 1

const pageListShow = 8

// Start document ready
$(function () {
  $.ajax({
    url: './data/posts.json',
    method: 'GET',
    success: function (result) {
      post(result)
    }
  })

  $.ajax({
    url: './data/authors.json',
    method: 'GET',
    success: function (result) {
      authorData = result
    }
  })

  post = (data) => {
    let newDataFormat = data.map((cv) => {
      let timeAgo = moment(cv.created_at, "YYYYMMDD").fromNow()
      return {
        ...cv,
        created_at: timeAgo,
      }
    })
    postData = newDataFormat
  }

  setTimeout(() => {
    mergeList()
  }, 1000)
})
// End document ready

mergeList = () => {
  allData = _.map(postData, function (data) {
    return _.extend(data, _.find(authorData, { id: data.author_id }))
  })

  let countPage = Math.ceil(allData.length / pageListShow)
  for (n = 0; n < countPage; n++) {
    pageList.push(n + 1)
  }

  render()
}

render = (currentPage = defaultCurrentPage) => {
  let startIndex = 0
  let lastIndex = 7

  if (currentPage !== 1) {
    startIndex = (currentPage - 1) * 8
    lastIndex = startIndex + 7
  }

  pageListActive = pageList.map((cv) => {
    return {
      page: cv,
      active: cv === currentPage,
    }
  })

  dataRender = allData.filter((cv, index) => index >= startIndex && index <= lastIndex)

  let context = {
    information: dataRender,
    pageList: pageListActive,
    currentPage,
  }

  let theTemplateScript = $("#built-in-helpers-template").html()
  let theTemplate = Handlebars.compile(theTemplateScript)
  let theCompiledHtml = theTemplate(context)
  $('.content-placeholder').html(theCompiledHtml)
}
