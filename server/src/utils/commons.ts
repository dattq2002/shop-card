import { random } from 'lodash'
import moment from 'moment-timezone'
import { TypeSeriAndCode } from '~/constants/enums'

//hàm xử lý enum đc mảng các số của enum
export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}
export const getCurrentDate = () => {
  const now = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
  return now
}
export const generateNumberCard = (type: string, lenght: number) => {
  if (type === TypeSeriAndCode.Seri) {
    const chart = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss')
    let now = ''
    for (let i = 0; i < lenght; i++) {
      now += chart[random(0, 9)]
    }
    return `ID${now}`
  } else if (type === TypeSeriAndCode.Code) {
    const chart = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss')
    let now = ''
    for (let i = 0; i < lenght; i++) {
      now += chart[random(0, 9)]
    }
    return `${now}`
  } else {
    throw new Error('Type must be Seri or Code')
  }
}
