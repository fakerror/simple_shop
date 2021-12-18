import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserController {
  public async index(ctx: HttpContextContract) {
    async function get() {
      let id = ctx.request.qs()['id']
      if (id === undefined) {
        return
      }
      return await User.find(id)
    }
    async function post() {}
    async function put() {}
    switch (ctx.request.method()) {
      case 'GET':
        return await get()
      case 'POST':
        return await post()
      case 'PUT':
        return await put()
      default:
        throw new Exception(`未知的方法 ${ctx.request.method()}`)
    }
  }
  public async login(ctx: HttpContextContract) {
    const username = ctx.request.input('username')
    const password = ctx.request.input('password')
    try {
      const token = await ctx.auth.use('api').attempt(username, password)
      return token
    } catch {
      return ctx.response.badRequest('Invalid credentials')
    }
  }
  public async change_password(ctx: HttpContextContract) {
    const user = await ctx.auth.use('api').authenticate()
    return user
  }
}
