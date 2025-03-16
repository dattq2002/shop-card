import { ObjectId } from 'mongodb'
import { TypeSeriAndCode } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'
import { ProductRequest } from '~/models/requests/product.request'
import { Product } from '~/models/schemas/product.schema'
import categoryService from '~/service/category.service'
import { generateNumberCard } from '~/utils/commons'

class ProductService {
  async createProduct({ payload, user_id, order_id }: { payload: ProductRequest; user_id: string; order_id?: string }) {
    const checkCateId = await categoryService.getCategoryById(payload.category_id)
    if (!checkCateId) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Category not found'
      })
    }
    // Generate many products to add to the database
    const products: Product[] = []
    for (let i = 0; i <= payload.quantity - 1; i++) {
      const insert = await databaseService.products.insertOne(
        new Product({
          category_id: new ObjectId(payload.category_id),
          seri: generateNumberCard(TypeSeriAndCode.Seri, 10),
          code: generateNumberCard(TypeSeriAndCode.Code, 12),
          user_id: new ObjectId(user_id),
          order_id: order_id ? new ObjectId(order_id) : new ObjectId()
        })
      )
      const newProduct = await databaseService.products.findOne(insert.insertedId)
      if (newProduct) products.push(newProduct)
    }
    return products
  }
  async deleteProduct(id: string) {
    const checkProduct = await databaseService.products.findOne(new ObjectId(id))
    if (!checkProduct) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Product not found'
      })
    }
    await databaseService.products.deleteOne({ _id: new ObjectId(id) })
    return checkProduct
  }
  async getAllProduct(page: number, size: number) {
    const total = await databaseService.products.countDocuments()
    const products = await databaseService.products
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .toArray()
    return {
      size,
      page,
      total,
      products
    }
  }
  async getProductByUserId(user_id: string) {
    const products = await databaseService.products.find({ user_id: new ObjectId(user_id) }).toArray()
    return products
  }
  async getProductByOrderId(order_id: string) {
    const products = await databaseService.products.find({ order_id: new ObjectId(order_id) }).toArray()
    return products
  }
}

const productService = new ProductService()
export default productService
