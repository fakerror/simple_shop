import { Exception } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash'
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
      ctx.response.badRequest('错误的用户名或者密码')
      return
    }
  }
  public async register(ctx: HttpContextContract) {
    const username = ctx.request.input('username')
    const password = ctx.request.input('password')

    if (await User.findBy('username', username)) {
      ctx.response.badRequest('用户名已存在')
      return
    }
    const user = new User()
    await user.fill({ username: username, password: password }).save()
    return '注册成功'
  }

  public async change_password(ctx: HttpContextContract) {
    const user = await ctx.auth.use('api').authenticate()

    const oldPassword = ctx.request.input('old_password')
    const newPassword = ctx.request.input('new_password')
    if (!(await Hash.verify(user.password, oldPassword))) {
      ctx.response.badRequest('原密码不正确')
      return
    }
    user.password = newPassword
    await user.save()
  }
}
