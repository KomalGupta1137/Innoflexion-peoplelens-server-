/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    logLevel: string
    server: Server
    sessionEncodingSecret: string
    jwt: Jwt
    redis: Redis
    privacyApi: PrivacyApi
    dbConnectionString: string
    objectiveScore: ObjectiveScore
    timeAllocation: TimeAllocation
    pipelineDiscipline: PipelineDiscipline
    followThroughPriority: FollowThroughPriority
    accountCoverage: PipelineDiscipline
    leaderBoardOutComes: LeaderBoardOutComes
    untouchedOpps: PipelineDiscipline
    productColorMap: ProductColorMap[]
    auth0: Auth0
    demoMode: DemoMode
  }
  interface DemoMode {
    keyDriversWidget: boolean
    peopleActivities: boolean
  }
  interface Auth0 {
    issuer: string
    audience: string
  }
  interface ProductColorMap {
    productName: string
    color: string
  }
  interface LeaderBoardOutComes {
    outCome1: string
    outCome2: string
    outCome3: string
    outCome4: string
  }
  interface FollowThroughPriority {
    meet1: number
    meet2: number
    meet3: number
    meet4: number
    meet5: number
    benchMark: number
  }
  interface PipelineDiscipline {
    benchMark: number
  }
  interface TimeAllocation {
    customer_meeting: number
    internal_meeting: number
    product_meeting: number
    systems_admin: number
    benchMark: number
  }
  interface ObjectiveScore {
    task: number
    email: number
    call: number
    customer_meeting: number
    internal_meeting: number
    product_meeting: number
    benchMark: number
  }
  interface PrivacyApi {
    host: string
    port: number
  }
  interface Redis {
    host: string
    port: number
    password: string
  }
  interface Jwt {
    publicKey: string
    issuer: string
    audience: string
    privateKey: string
    expiresInSeconds: number
  }
  interface Server {
    host: string
    port: number
    healthCheckHeader: string
  }
  export const config: Config
  export type Config = IConfig
}
