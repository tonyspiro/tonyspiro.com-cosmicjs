// Home page
import Cosmic from 'cosmicjs'
import moment from 'moment'
module.exports = (app, config, partials) => {
  app.get('/', (req, res) => {
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
      // Friendly dates
      const friendly_date_posts = current_posts.map(post => {
        const created_friendly = moment(post.created).format('MMMM Do, YYYY')
        post.created_friendly = created_friendly
        return post
      })
      res.locals.cosmic.objects.type.posts = friendly_date_posts
      const next_page = page + 1
      let prev_page = page - 1
      if (prev_page < 0)
        prev_page = 0
      res.locals.next_page = next_page
      res.locals.prev_page = prev_page
      res.locals.prev_disabled = false
      res.locals.next_disabled = false
      if (!prev_page)
        res.locals.prev_disabled = true
      // Check if last page
      if (!posts[offset + per_page + 1])
        res.locals.next_disabled = true
      return res.render('index.html', {
        partials
      })
    })
  })
}