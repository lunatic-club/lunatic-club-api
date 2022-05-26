/* eslint-disable no-restricted-syntax */
import http from 'http'
import fs from 'fs'
import https from 'https'
import Koa from 'koa'
import Router from '@koa/router'
import setupRoutes from './router.js'
import setupMiddlewares from '../middlewares/index.js'
import {createLcd} from '../services/terra.js'

const start = async routes => {
  const app = new Koa()
  const router = setupRoutes(Router(), routes)
  await createLcd()

  app
    .use(setupMiddlewares())
    .use(router.routes())
    .use(router.allowedMethods())
    
  if(process.env.NODE_ENV === 'development') {
    const key = fs.readFileSync('./certs/server.key', 'utf8')
    const cert = fs.readFileSync('./certs/server.crt', 'utf8')
    const credentials = {key, cert}

    https
      .createServer(credentials, app.callback())
      .listen(process.env.SERVER_HTTPS_PORT, () => {
        console.log(`Koa https server listening on port ${process.env.SERVER_HTTPS_PORT} and worker ${process.pid}`)
      })
  }
  http
    .createServer(app.callback())
    .listen(process.env.SERVER_PORT, () => {
      console.log(`Koa http server listening on port ${process.env.SERVER_PORT}`)
    })
}

export default start
