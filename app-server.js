// app-server.js
import express from 'express'
import hogan from 'hogan-express'
import http_module from 'http'
import compression from 'compression'
const config = {
  COSMIC_BUCKET: process.env.COSMIC_BUCKET || 'future-imperfect'
}
const app = express()
app.use(compression())
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.set('port', process.env.PORT || 3000)
app.use(express.static(__dirname + '/public'))
app.use((req, res, next) => {
  if (req.url === '/favicon.ico')
    return res.end()
  // Redirect to canonical url
  if (req.headers.host !== 'tonyspiro.com')
    return res.redirect('http://tonyspiro.com' + req.url)
  // Set global valiables
  res.locals.year = new Date().getFullYear()
  // Set dev
  if (process.env.NODE_ENV === 'development')
    res.locals.is_dev = true
  next()
})
const partials = {
  header: 'partials/header',
  footer: 'partials/footer',
  nav: 'partials/nav',
  sidebar: 'partials/sidebar',
  'posts-big': 'partials/posts-big',
  'posts-mini': 'partials/posts-mini',
  'posts-list': 'partials/posts-list',
}
require('./routes/home')(app, config, partials)
require('./routes/work')(app, config, partials)
require('./routes/search')(app, config, partials)
require('./routes/page')(app, config, partials)
require('./routes/404')(app, config, partials)
const http = http_module.Server(app)
http.listen(app.get('port'), () => {
  console.info('==> 🌎  Go to http://localhost:%s', app.get('port'));
})