type Domain = {
  /** 域名类型 */
  domain: 'Plain' | 'Regex' | 'RootDomain' | 'Full'
  value: string
}

type GeoSite = {
  /** 国家代码 */
  countryCode: string
  /** 域名 */
  domain: Domain[]
}

export type GeoSiteList = {
  entry: GeoSite[]
}
