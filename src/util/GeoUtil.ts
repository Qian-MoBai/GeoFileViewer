import type { GeoIPList } from '@/types/GeoIP'
import type { GeoSiteList } from '@/types/GeoSite'
import { Base64 } from 'js-base64'
import protobufjs from 'protobufjs'

/** 解析 Geo 文件 */
export async function parseGeoFile(
  flag: string,
  url: string,
): Promise<GeoSiteList | GeoIPList | null> {
  const config = flag === 'geosite' ? 'geosite' : 'geoip'
  const root = await protobufjs.load(`/config/${config}.proto`)
  const geoList = root.lookupType(flag === 'geosite' ? 'GeoSiteList' : 'GeoIPList')
  const file = await (await fetch(url)).arrayBuffer()
  const geo = geoList.decode(new Uint8Array(file))
  switch (flag) {
    case 'geosite':
      return geo.toJSON() as GeoSiteList
    case 'geoip':
      const geoipList = geo.toJSON() as GeoIPList
      geoipList.entry.forEach((geoip) => {
        geoip.cidr.forEach((cidr) => {
          cidr.ip = decodeIP(cidr.ip)
        })
      })
      return geoipList
    default:
      return null
  }
}
/** 解码IP */
export function decodeIP(base64: string): string {
  const bytes = Base64.toUint8Array(base64)
  if (bytes.length === 4) {
    return Array.from(bytes).join('.')
  }

  if (bytes.length === 16) {
    const parts = []
    for (let i = 0; i < 16; i += 2) {
      parts.push((bytes[i]! * 256 + bytes[i + 1]!).toString(16))
    }
    return parts.join(':')
  }

  return 'unknown'
}
