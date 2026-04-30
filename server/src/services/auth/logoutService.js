class LogoutService {
  async logout(req) {
    req.session.destroy()
    return { message: 'Logged out successfully' }
  }
}

export default new LogoutService()