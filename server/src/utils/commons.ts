import moment from 'moment-timezone'

//hàm xử lý enum đc mảng các số của enum
export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}
export const getCurrentDate = () => {
  const now = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
  return now
}
