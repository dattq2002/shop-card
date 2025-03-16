export const USERS_MESSAGES = {
  REGISTER_SUCCESS: 'Register success',
  VALIDATION_ERROR: 'Validation error',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Password length must be from 8 to 50',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Confirm password length must be from 8 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm password must be strong',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  PHONE_MUST_BE_A_STRING: 'Phone must be a string',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  USER_BANNED: 'User banned',
  EMAIL_VERIFY_TOKEN_IS_NOT_MATCH: 'Email verify token is not match',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_EMAIL_VERIFY_SUCCESS: 'Resend email verify success',
  EMAIL_NOT_FOUND: 'Email not found',
  LOGIN_SUCCESS: 'Login success',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  RE_PROVIDE_TOKEN_SUCCESS: 'Re-provide token success',
  GET_ALL_USERS_SUCCESS: 'Get all users success',
  GET_USER_BY_ID_SUCCESS: 'Get user by id success',
  GET_ME_SUCCESS: 'Get me success',
  LOGOUT_SUCCESS: 'Logout success',
  LOGOUT_FAIL: 'Logout fail',
  YOU_HAVE_NOT_LOGGED_IN: 'You have not logged in',
  UPDATE_USER_SUCCESS: 'Update user success',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Name length must be from 1 to 50'
} as const

export const CATEGORIES_MESSAGES = {
  DISCOUNT_PERCENT_MUST_BE_A_NUMBER: 'Discount percent must be a number',
  DISCOUNT_PERCENT_MUST_BE_FROM_0_TO_100: 'Discount percent must be from 0 to 100',
  PRICE_IS_REQUIRED: 'Price is required',
  PRICE_MUST_BE_A_NUMBER: 'Price must be a number'
} as const

export const PRODUCTS_MESSAGES = {
  CREATE_PRODUCT_SUCCESS: 'Create product success',
  CATEGORY_ID_IS_REQUIRED: 'Category Id is required',
  CATEGORY_ID_MUST_BE_A_STRING: 'Category Id must be a string',
  QUANTITY_IS_REQUIRED: 'Quantity is required',
  QUANTITY_MUST_BE_A_NUMBER: 'Quantity must be a number',
  QUANTITY_MUST_BE_AN_INTEGER: 'Quantity must be an integer'
} as const

export const AUTH_MESSAGES = {
  YOU_DO_NOT_PERMISSION_TO_ACCESS: 'You do not permission to access'
} as const

export const ORDER_MESSAGES = {
  NOT_EMPTY_TOTAL: 'Not empty total',
  NOT_EMPTY_PRODUCTS: 'Not empty products',
  NOT_EMPTY_USER_ID: 'Not empty user id',
  INVALID_USER_ID: 'Invalid user id',
  INVALID_PRODUCTS: 'Invalid products',
  INVALID_TOTAL: 'Invalid total',
  INVALID_TOTAL_INT: 'Invalid total int'
} as const
