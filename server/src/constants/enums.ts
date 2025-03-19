export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum TokenType {
  AccessToken,
  RefeshToken,
  ForgotPasswordToken,
  EmailVerificationToken
}

export const RoleTypes = {
  Admin: 'Admin',
  Customer: 'Customer'
}

export const TypeSeriAndCode = {
  Seri: 'Seri',
  Code: 'Code'
}

export const OrderStatus = {
  Pending: 'Pending',
  Completed: 'Completed',
  Cancelled: 'Cancelled'
}

export enum PaymentMethod {
  CASH = 'Cash',
  ZALOPAY = 'ZaloPay'
}
