import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { Client } from '@elastic/elasticsearch'

/**
 * Provider to register shield middleware
 */
export default class ElasticProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true

  public register() {
    this.app.container.singleton('Elastic', () => {
      const Env = this.app.container.resolveBinding('Adonis/Core/Env')
      const elasticUrl: string = Env.get('ELASTIC_SEARCH_URL')
      const client: Client = new Client({
        node: elasticUrl,
      })

      return client
    })
  }

  public boot() {}
}
