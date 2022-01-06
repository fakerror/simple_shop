declare module '@ioc:Elastic' {
  import * as es from '@elastic/elasticsearch'
  const Client: es.Client
  export default Client
}
