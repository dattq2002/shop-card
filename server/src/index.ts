import { config } from 'dotenv'
import express from 'express'
import databaseService from '~/database/config.database'
import { defaultErrorHandler } from '~/middlewares/error.middleware'
import authRouter from '~/routes/auth.route'
import path from 'path'
import productRouter from '~/routes/product.route'
import categoryRouter from '~/routes/category.route'
import userRouter from '~/routes/user.route'

config()
const app = express()
const port = process.env.PORT
app.use(express.json())
databaseService.connect().then(() => {
  // databaseService.initDatabase()
})
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Server' })
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRouter)
app.use(defaultErrorHandler as any)
app.listen(port, () => {
  console.log(`Server này đang chạy trên post ${port}`)
})
