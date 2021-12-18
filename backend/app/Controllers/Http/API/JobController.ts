import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Job from 'App/Jobs/Order'
import Bull from '@ioc:Rocketseat/Bull'
export default class JobController {
  public async make_order(ctx: HttpContextContract) {
    const job = new Job()
    return Bull.add(job.key, ctx.request.all())
  }
  public async status(ctx: HttpContextContract) {
    const id = ctx.request.qs()['id']
    if (id === undefined) {
      return
    }
    return Bull.getByKey(new Job().key).bull.getJob(id)
  }
}
