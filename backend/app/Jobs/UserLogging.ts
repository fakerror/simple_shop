import Logger from '@ioc:Adonis/Core/Logger'
import { JobContract, JobsOptions, QueueOptions, WorkerOptions } from '@ioc:Rocketseat/Bull'
import UserLog from 'App/Models/UserLog'

export default class UserLogging implements JobContract {
  public options: JobsOptions = {}
  public queueOptions: QueueOptions = {}
  public workerOptions: WorkerOptions = {}
  public concurrency = 2

  public static key = 'UserLogging'
  public key = UserLogging.key

  public async handle(job: any) {
    const data = job.data
    Logger.info(`job_start user logging ${data.username}`)

    const l = new UserLog()
    l.username = data.username
    l.log = data.log
    await l.save()

    Logger.info('job_end user logging')
  }
}
