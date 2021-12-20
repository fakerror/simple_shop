import { Exception } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Admin from 'App/Models/Admin'

export default class AdminController {
  public async index(ctx: HttpContextContract) {
    async function get() {
      const id = ctx.request.qs()['id']
      if (id === undefined) {
        return await Admin.all()
      }
      return await Admin.find(id)
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
      const token = await ctx.auth.use('admin_api').attempt(args.username, args.password)
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

    if (await Admin.findBy('username', args.username)) {
      ctx.response.badRequest('用户名已存在')
      return
    }
    const user = new Admin()
    await user.fill(args).save()
    return '注册成功'
  }

  public async change_password(ctx: HttpContextContract) {
    const user = await ctx.auth.use('admin_api').authenticate()

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
}
