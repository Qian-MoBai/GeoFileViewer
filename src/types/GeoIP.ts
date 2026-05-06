type CIDR = {
  ip: string
  prefix: number
}

type GeoIP = {
  /** 国家代码 */
  countryCode: string
  /** CIDR */
  cidr: CIDR[]
}

export type GeoIPList = {
  entry: GeoIP[]
}
