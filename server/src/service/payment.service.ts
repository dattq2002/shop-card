import { OrderStatus, PaymentMethod } from '~/constants/enums'
import databaseService from '~/database/config.database'
import { Order } from '~/models/schemas/order.schema'
import { Payment } from '~/models/schemas/payment.schema'
import { Transaction } from '~/models/schemas/transaction.schema'
import { paymentOnlineZaloPay } from '~/utils/payment_online'

class PaymentService {
  async processPayment(order: Order, paymentMethod: PaymentMethod) {
    const newPayment = await databaseService.payments.insertOne(
      new Payment({
        amount: order.total,
        payment_method: paymentMethod,
        order_id: order._id
      })
    )
    await databaseService.transactions.insertOne(
      new Transaction({
        order_id: order._id,
        amount: order.total,
        payment_id: newPayment.insertedId
      })
    )

    if (paymentMethod === PaymentMethod.ZALOPAY) {
      const embedData = {
        redirecturl: 'http://localhost:4000/api/order/confirm-online/' + order._id
      }
      const result = await paymentOnlineZaloPay({
        items: order.products,
        embed_data: embedData,
        order_id: order._id.toString(),
        amount: order.total,
        user_id: order.userId.toString()
      })
      return result
    }
    return await databaseService.payments.findOne({ order_id: order._id })
  }
}
const paymentService = new PaymentService()
export default paymentService
