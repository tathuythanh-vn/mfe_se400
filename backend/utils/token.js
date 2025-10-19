
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
configDotenv()

export const signToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.JWT_KEY, { expiresIn: '18h' })
    return token
  } catch (error) {
    console.log(error)
  }
}

export const verifyToken = (token) => {
  try {
    const data = jwt.verify(token,process.env.JWT_KEY)
    return data
  } catch (error) {
    console.log(error)
  }
}