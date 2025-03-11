import { config } from 'dotenv'
import express from 'express'
import databaseService from '~/database/config.database'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import authRouter from '~/routes/auth.route'
import userRouter from '~/routes/user.route'
import path from 'path'

config()
const app = express()
const port = process.env.PORT
app.use(express.json())
databaseService.connect().then(() => {
  // databaseService.initDatabase()
})
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Server' })
})
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use(defaultErrorHandler as any)
app.listen(port, () => {
  console.log(`Server này đang chạy trên post ${port}`)
})
