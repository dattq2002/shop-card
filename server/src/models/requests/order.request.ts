import { PaymentMethod } from '~/constants/enums'
import { IProductOrder } from '~/models/schemas/order.schema'

export interface OrderRequest {
  payment_method: PaymentMethod
  products: IProductOrder[]
  total: number
}
