const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 80
const dev = process.env.NODE_ENV !== 'production'
// const dev = false
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
  
    server.get('/category/:id', (req, res) => {
      console.log( 'req', req , res )
      return app.render(req, res, '/category/[id]', { id: req.params.id })
    })

    // server.get('/doc/lawyer/seal/request/:id', (req, res) => {
    //   console.log( 'req', req , res )
    //   return app.render(req, res, '/doc/lawyer/seal/request/[id]', { id: req.params.id })
    // })

    server.all('*', (req, res) => {
      return handle(req, res)
    })
  
    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })