// Other pages
import Cosmic from 'cosmicjs'
import moment from 'moment'
module.exports = (app, config, partials) => {
  app.get('/work', (req, res) => {
    const slug = 'work'
    if (req.url === '/favicon.ico')
      return res.end()
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET } }, (err, response) => {
      res.locals.cosmic = response
      const posts = response.objects.type.posts
      // Pagination
      let page = 1
      if (req.query.page)
        page = Number(req.query.page)
      const per_page = 5
      const offset = (page - 1) * per_page
      const current_posts = posts.slice(offset, offset + per_page)
      // Sort
      const sorted_posts = current_posts.sort(post => {
        if (post.metafield.published)
          return moment(post.metafield.published.value).format('YYYMMDD') * -1
      })
      // Friendly dates
      const friendly_date_posts = sorted_posts.map(post => {
        let published_friendly = 0
        if (post.metafield.published)
          published_friendly = moment(post.metafield.published.value).format('MMMM Do, YYYY')
        post.published_friendly = published_friendly
        return post
      })
      res.locals.cosmic.objects.type.posts = friendly_date_posts
      // Get current page
      const pages = response.objects.type.pages
      pages.forEach(page => {
        if (page.slug === slug)
          res.locals.page = page
      })
      if (!res.locals.page) {
        return res.render('404.html', {
          partials
        })  
      }
      if (req.url === '/work') {
        partials['work-big'] = 'partials/work-big'
        return res.render('work.html', {
          partials
        })  
      }
    })
  })
}