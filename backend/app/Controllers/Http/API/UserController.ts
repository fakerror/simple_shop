import { Exception } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UserController {
  public async index(ctx: HttpContextContract) {
    async function get() {
      const id = ctx.request.qs()['id']
      if (id === undefined) {
        return await User.all()
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
    const validator = schema.create({
      username: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    })
    const args = await ctx.request.validate({ schema: validator })

    try {
      const token = await ctx.auth.use('user_api').attempt(args.username, args.password)
      return token
    } catch {
      ctx.response.badRequest('错误的用户名或者密码')
      return
    }
  }
  public async register(ctx: HttpContextContract) {
    const validator = schema.create({
      username: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    })
    const args = await ctx.request.validate({ schema: validator })

    if (await User.findBy('username', args.username)) {
      ctx.response.badRequest('用户名已存在')
      return
    }
    const user = new User()
    await user.fill(args).save()
    return '注册成功'
  }

  public async change_password(ctx: HttpContextContract) {
    const user = await ctx.auth.use('user_api').authenticate()

    const validator = schema.create({
      old_password: schema.string({ trim: true }),
      new_password: schema.string({ trim: true }),
    })
    const args = await ctx.request.validate({ schema: validator })

    if (!(await Hash.verify(user.password, args.old_password))) {
      ctx.response.badRequest('原密码不正确')
      return
    }
    user.password = args.new_password
    await user.save()
  }

  public async logout(ctx: HttpContextContract) {
    await ctx.auth.use('user_api').authenticate()

    await ctx.auth.use('user_api').logout()
  }

  public async order_list(ctx: HttpContextContract) {
    const user = await ctx.auth.use('user_api').authenticate()

    await user.load('orders', (orders_query) => {
      orders_query.preload('product')
    })

    return user.orders
  }
}
