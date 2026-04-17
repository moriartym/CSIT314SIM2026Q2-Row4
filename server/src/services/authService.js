import bcrypt from 'bcrypt'
import UserRepository from '../repositories/UserRepository.js'

class AuthService {
  async login(username, password, req) {
    if (!username || username.trim() === '') {
      throw new Error('Username is required')
    }
    if (!password || password.trim() === '') {
      throw new Error('Password is required')
    }

    const user = await UserRepository.findByUsername(username)
    
    if (!user) throw new Error('Invalid credentials')

    if (!user.isActive) throw new Error('Account is suspended')

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new Error('Invalid credentials')

    req.session.userId = user._id

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      userProfile: user.userProfile
    }
  }

  async logout(req) {
    req.session.destroy()
    return { message: 'Logged out successfully' }
  }
}

export default new AuthService()