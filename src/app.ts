import express, { Request, Response } from 'express'
import logger from './utils/logger'
import routes from './routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import deserializeUser from './middlewares/deserializeUser'
import path from 'path'
import * as cloudinaryNpm from 'cloudinary'

import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'

import './utils/mongodb'
import cloudinary from './config/cloudinary'

import * as redis from 'redis'
import { apiLimiter } from './middlewares/rate-limt'
import rateLimit from 'express-rate-limit'

const swaggerDoc = YAML.load('./src/doc.yaml')

const PORT = process.env.PORT || 5000

cloudinaryNpm.v2.config({
  cloud_name: cloudinary.cloudinaryName,
  api_key: cloudinary.cloudinaryApiKey,
  api_secret: cloudinary.cloudinaryApiSecret
})

const app = express()
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())
app.use(deserializeUser)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/v1/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/visits', async (req: Request, res: Response) => {
  const client = redis.createClient({
    url: 'redis://redis-server:6379'
  })
  await client.connect()
  client
    .get('visits')
    .then((data) => {
      console.log(data)
      let num
      if (!data) {
        num = 0
      } else {
        num = parseInt(data as string)
      }
      res.send({ num })
      client.set('visits', num + 1)
    })
    .catch((err) => {
      res.send(err.message)
    })
})

app.use(routes)

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
})
