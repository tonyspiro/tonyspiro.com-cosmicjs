// Other pages
import Cosmic from 'cosmicjs'
import moment from 'moment'
module.exports = (app, config, partials) => {
  app.get('/:slug', (req, res) => {
    const slug = req.params.slug
    if (req.url === '/favicon.ico')
      return res.end()
    Cosmic.getObjects({ bucket: { slug: config.COSMIC_BUCKET } }, (err, response) => {
      res.locals.cosmic = response
      const posts = response.objects.type.posts
      // Pagination
      const offset = 0
      const per_page = 5
      const current_posts= posts.slice(offset, offset + per_page)
      // Friendly dates
      const friendly_date_posts = current_posts.map(post => {
        const created_friendly = moment(post.created).format('MMMM Do, YYYY')
        post.created_friendly = created_friendly
        return post
      })
      // Get current page / post
      const objects = response.objects.all
      objects.forEach(page => {
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
      res.locals.cosmic.objects.type.posts = friendly_date_posts
      return res.render('page.html', {
        partials
      })
    })
  })
}