import protobufjs from 'protobufjs'
export async function parseGeoFile(flag: string = 'geosite') {
  const config = flag === 'geosite' ? 'geosite' : 'geoip'
  const root = await protobufjs.load(`/config/${config}.proto`)
  const geoList = root.lookupType(flag === 'geosite' ? 'GeoSiteList' : 'GeoIPList')
  const file = await (await fetch(`/GeoSite.dat`)).arrayBuffer()
  const geo = geoList.decode(new Uint8Array(file))
  console.log(geo.toJSON())
  return geo.toJSON()
}
