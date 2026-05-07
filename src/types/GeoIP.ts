type CIDR = {
  ip: string
  prefix: number
}

export type GeoIP = {
  /** 国家代码 */
  countryCode: string
  /** CIDR */
  cidr: CIDR[]
}

export type GeoIPList = {
  entry: GeoIP[]
}
