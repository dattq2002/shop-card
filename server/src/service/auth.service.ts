import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/database/config.database'
import { ErrorWithStatus } from '~/models/errors'
import { RegisterReqBody } from '~/models/requests/user.request'
import RefreshToken from '~/models/schemas/refreshToken.schema'
import User from '~/models/schemas/user.schema'
import { StringValue } from '~/type'
import { getCurrentDate } from '~/utils/commons'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { sendNoReplyEmail, sendVerificationEmail } from '~/utils/mailer'

class AuthService {
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, type: TokenType.EmailVerificationToken, verify },
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as StringValue },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
  }
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, type: TokenType.AccessToken, verify },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as StringValue },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }
  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: { user_id, type: TokenType.RefeshToken, verify, exp },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    } else {
      return signToken({
        payload: { user_id, type: TokenType.RefeshToken, verify },
        options: { expiresIn: process.env.REFESH_TOKEN_EXPIRE_IN as StringValue },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
  }
  private signAccessTokenAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }
  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async register(req: RegisterReqBody) {
    const user_id = new ObjectId()
    const newUser = await databaseService.users.insertOne(
      new User({
        ...req,
        _id: user_id,
        password: hashPassword(req.password),
        verify: UserVerifyStatus.Unverified
      })
    )
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: newUser.insertedId.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.updateOne(
      {
        _id: newUser.insertedId
      },
      [
        {
          $set: {
            email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )
    const [access_token, refesh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: newUser.insertedId.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const { exp, iat } = await this.decodeRefreshToken(refesh_token)
    //lưu refesh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refesh_token,
        user_id: newUser.insertedId,
        exp,
        iat
      })
    )
    console.log(email_verify_token)
    sendVerificationEmail(req.email, req.name, `${process.env.HTTP_PREFIX}/auth/verify-email/${email_verify_token}`)
    return { access_token, refesh_token }
  }
  async verifyEmail(user_id: string) {
    //cập nhật lại user'
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            verify: UserVerifyStatus.Verified, //1
            email_verify_token: '',
            updated_at: '$$NOW'
          }
        }
      ]
    )
    //tạo access token và refresh token
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Verified
    })
    const { exp, iat } = await this.decodeRefreshToken(refresh_token)
    //lưu refesh token vào db
    await databaseService.refreshTokens.updateOne(
      {
        user_id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            token: refresh_token,
            exp,
            iat,
            updated_at: '$$NOW'
          }
        }
      ]
    )
    return { access_token, refresh_token }
  }
  async resendEmailVerify(user: User) {
    if (user.verify === UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
      })
    }
    //tạo email verify token
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user._id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    //cập nhật lại user
    await databaseService.users.updateOne(
      {
        _id: user._id
      },
      [
        {
          $set: {
            email_verify_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )
    //giả lập gửi email verify token
    console.log(email_verify_token)
    sendVerificationEmail(user.email, user.name, `${process.env.HTTP_PREFIX}/auth/verify-email/${email_verify_token}`)
    return {
      message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS
    }
  }
  async login(user_id: ObjectId) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Verified
    })
    const { exp, iat } = await this.decodeRefreshToken(refresh_token)
    //lưu refesh token vào db
    const result = await databaseService.refreshTokens.updateOne(
      {
        user_id: user_id
      },
      [
        {
          $set: {
            token: refresh_token,
            exp,
            iat,
            updated_at: getCurrentDate()
          }
        }
      ]
    )
    console.log(result)
    if (result.matchedCount === 0) {
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({
          _id: new ObjectId(),
          token: refresh_token,
          user_id,
          exp,
          iat
        })
      )
    }
    return { access_token, refresh_token }
  }
  async refreshToken(user_id: ObjectId) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Verified
    })
    const { exp, iat } = await this.decodeRefreshToken(refresh_token)
    //lưu refesh token vào db
    await databaseService.refreshTokens.updateOne(
      {
        user_id
      },
      [
        {
          $set: {
            token: refresh_token,
            exp,
            iat,
            updated_at: '$$NOW'
          }
        }
      ]
    )
    return { access_token, refresh_token }
  }
  async logout(user_id: string) {
    const result = await databaseService.refreshTokens.deleteOne({
      user_id: new ObjectId(user_id)
    })
    return Boolean(result)
  }
}

const authService = new AuthService()
export default authService
