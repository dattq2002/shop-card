import { Order } from '~/models/schemas/order.schema'
import { TokenPayload } from './models/requests/user.request'
import User from './models/schemas/user.schema'
import { Request } from 'express'
// file này dùng để định nghĩa lại những cái có sẵn
declare module 'express' {
  interface Request {
    user?: User
    order?: Order
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}

type Unit =
  | 'Years'
  | 'Year'
  | 'Yrs'
  | 'Yr'
  | 'Y'
  | 'Weeks'
  | 'Week'
  | 'W'
  | 'Days'
  | 'Day'
  | 'D'
  | 'Hours'
  | 'Hour'
  | 'Hrs'
  | 'Hr'
  | 'H'
  | 'Minutes'
  | 'Minute'
  | 'Mins'
  | 'Min'
  | 'M'
  | 'Seconds'
  | 'Second'
  | 'Secs'
  | 'Sec'
  | 's'
  | 'Milliseconds'
  | 'Millisecond'
  | 'Msecs'
  | 'Msec'
  | 'Ms'

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

type StringValue = `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`
