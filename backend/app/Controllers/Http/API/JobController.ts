import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Job from 'App/Jobs/Atomic'
import Bull from '@ioc:Rocketseat/Bull'
import { Action, JobData } from 'App/Jobs/Atomic'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class JobController {
  public async order_make(ctx: HttpContextContract) {
    const user = await ctx.auth.use('user_api').authenticate()
    const validator = schema.create({
      product_id: schema.string({ trim: true }),
      quantity: schema.number(),
    })

    const args = await ctx.request.validate({ schema: validator })

    if (!Number.isInteger(args.quantity)) {
      ctx.response.badRequest('quantity 必须为整数')
      return
    }

    const jobData = new JobData()
    jobData.action = Action.order_make
    jobData.args = Object.assign({ user_id: user.id }, args)
    return Bull.add(Job.key, jobData)
  }
  public async product_quantity_add(ctx: HttpContextContract) {
    const validator = schema.create({
      product_id: schema.string({ trim: true }),
      quantity_add: schema.number(),
    })

    const args = await ctx.request.validate({ schema: validator })

    if (!Number.isInteger(args.quantity_add)) {
      ctx.response.badRequest('quantity_add 必须为整数')
      return
    }

    const jobData = new JobData()
    jobData.action = Action.product_quantity_add
    jobData.args = args
    return Bull.add(Job.key, jobData)
  }
  public async order_trans_info_set(ctx: HttpContextContract) {
    const validator = schema.create({
      order_id: schema.string({ trim: true }),
      trans_info: schema.string({ trim: true }),
    })

    const args = await ctx.request.validate({ schema: validator })

    const jobData = new JobData()
    jobData.action = Action.order_trans_info_set
    jobData.args = args
    return Bull.add(Job.key, jobData)
  }
  public async status(ctx: HttpContextContract) {
    const id = ctx.request.qs()['id']
    if (id === undefined) {
      return
    }
    const job = await Bull.getByKey(Job.key).bull.getJob(id)
    return job?.getState()
  }
}
