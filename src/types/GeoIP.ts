type CIDR = {
  ip: string
  prefix: number
}

type GeoIP = {
  /** 国家代码 */
  country_code: string
  /** CIDR */
  cidr: CIDR[]
}

export type GeoIPList = {
  entry: GeoIP[]
}
