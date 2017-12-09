### My Blog Built using Node.js and Cosmic JS
##### [View a demo here](http://tonyspiro.com/)
[Sign up for Cosmic JS](https://cosmicjs.com/) to start managing content for your websites and applications faster and easier.
The frontend is from [html5up.net](html5up.net) and is made dynamic with mustache `{{ }}` braces with content from the [Cosmic JS Client for JavaScript](https://www.npmjs.com/package/cosmicjs).
#### Get Started
In ```app-server.js``` set your Cosmic JS bucket slug:
```
const config = {
  COSMIC_BUCKET: process.env.COSMIC_BUCKET || 'your-blog-slug'
}
```
Then install:
```
npm install
```
Then run 
```
npm start
```
Go to [http://localhost:3000](http://localhost:3000) in your browser of choice.
