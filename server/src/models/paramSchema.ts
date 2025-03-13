import { ParamSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'

export const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      // minLowercase: 1,
      // minUppercase: 1,
      // minNumbers: 1,
      // minSymbols: 1
      returnScore: true
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}
export const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      // minLowercase: 1,
      // minUppercase: 1,
      // minNumbers: 1,
      // minSymbols: 1
      returnScore: true
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}
export const emailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
  },
  isEmail: {
    errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
  },
  custom: {
    options: async (value, { req }) => {
      const userExist = await databaseService.users.findOne({
        email: value
      })
      if (userExist) {
        req.user = userExist
        return true
      }
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
}

export const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 50
    },
    errorMessage: 'Name length must be from 1 to 50'
  }
}

export const avatarSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: 'Avatar must be a string'
  }
}
