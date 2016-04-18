// Other pages
import Cosmic from 'cosmicjs'
import moment from 'moment'
module.exports = (app, config, partials) => {
  app.get('/search', (req, res) => {
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
      // Search results
      const q = req.query.q
      const objects = response.objects.all
      const results = objects.filter(object => {
        if (object.title.toLowerCase().indexOf(q.toLowerCase()) !== -1 || object.content.toLowerCase().indexOf(q.toLowerCase()) !== -1) {
          return object
        }
      })
      res.locals.q = q
      res.locals.results = results
      res.locals.num_results = results.length
      partials['search-results'] = 'partials/search-results'
      return res.render('search.html', {
        partials
      })
    })
  })
}