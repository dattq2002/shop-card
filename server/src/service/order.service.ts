import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'
import { OrderRequest } from '~/models/requests/order.request'
import { Order } from '~/models/schemas/order.schema'
import { Payment } from '~/models/schemas/payment.schema'
import { Product } from '~/models/schemas/product.schema'
import productService from '~/service/product.service'
import { getCurrentDate } from '~/utils/commons'

class OrderService {
  async createOrder(req: OrderRequest, userId: string) {
    const result = await databaseService.orders.insertOne(
      new Order({
        ...req,
        userId: new ObjectId(userId)
      })
    )
    return await databaseService.orders.findOne({ _id: result.insertedId })
  }
  async getOrderById(id: string) {
    return await databaseService.orders.findOne({ _id: new ObjectId(id) })
  }
  async getOrderAll(page: number, size: number) {
    const total = await databaseService.orders.countDocuments()
    const orders = await databaseService.orders
      .find()
      .skip((page - 1) * size)
      .limit(size)
      .toArray()
    return {
      size,
      page,
      total,
      orders
    }
  }
  async updateOrder(id: string, req: OrderRequest, userId: string) {
    const result = await databaseService.orders.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      {
        $set: {
          ...req,
          updated_at: getCurrentDate()
        }
      }
    )
    if (result.matchedCount !== 0) {
      return await databaseService.orders.findOne({ _id: new ObjectId(id) })
    }
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: 'Order not found'
    })
  }
  async cancelOrder(id: string, userId: string) {
    const result = await databaseService.orders.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      {
        $set: {
          status: OrderStatus.Cancelled,
          updated_at: getCurrentDate()
        }
      }
    )
    if (result.matchedCount !== 0) {
      return await databaseService.orders.findOne({ _id: new ObjectId(id) })
    }
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: 'Order not found'
    })
  }
  async confirmOrder(id: string, userId?: string) {
    if (userId !== undefined) {
      const result = await databaseService.orders.updateOne(
        { _id: new ObjectId(id), userId: new ObjectId(userId), status: OrderStatus.Pending },
        {
          $set: {
            status: OrderStatus.Completed,
            updated_at: getCurrentDate()
          }
        }
      )
      if (result.matchedCount !== 0) {
        return await databaseService.orders.findOne({ _id: new ObjectId(id) })
      }
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Order not found or Order is not pending'
      })
    } else {
      const result = await databaseService.orders.updateOne(
        { _id: new ObjectId(id), status: OrderStatus.Pending },
        {
          $set: {
            status: OrderStatus.Completed,
            updated_at: getCurrentDate()
          }
        }
      )
      if (result.matchedCount !== 0) {
        return await databaseService.orders.findOne({ _id: new ObjectId(id) })
      }
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: 'Order not found or Order is not pending'
      })
    }
  }
  async generateProduct(order: Order) {
    order.products.forEach(async (element) => {
      await productService.createProduct({
        payload: { category_id: element._id, quantity: element.quantity },
        user_id: order.userId.toString(),
        order_id: order._id.toString()
      })
    })

    return true
  }
}

const orderService = new OrderService()
export default orderService
