import { config } from 'dotenv'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { Order } from '~/models/schemas/order.schema'
import { Category, Product } from '~/models/schemas/product.schema'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import User from '~/models/schemas/user.schema'

config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shopcard.9c8qc.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log(`Pinged your deployment. You successfully connected to ${process.env.DB_NAME} in MongoDB!`)
      return true
    } catch (err) {
      console.log('lỗi trong quá trình kết nối', err)
      throw err
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  initDatabase() {
    // this.users.insertMany([
    //   {
    //     _id: new ObjectId(),
    //     email: 'user1@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user2@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user3@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user4@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user5@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user6@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user7@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   },
    //   {
    //     _id: new ObjectId(),
    //     email: 'user8@gmail.com',
    //     password: '',
    //     verify: 1,
    //     email_verify_token: '',
    //     avatar: '',
    //     name: '',
    //     role: 'Customer',
    //     flag: false,
    //     create_date: new Date(),
    //     update_date: new Date()
    //   }
    // ])
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }
  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORIES_COLLECTION as string)
  }
  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }
}
const databaseService = new DatabaseService()
export default databaseService
