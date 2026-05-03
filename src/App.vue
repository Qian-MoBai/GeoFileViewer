<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { parseGeoFile } from '@/util/GeoUtil'
const data: Ref<any> = ref({})
onMounted(async () => {
  data.value = await parseGeoFile(
    'geoip',
    'https://gh-proxy.org/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/release/geoip.dat',
  )
  console.log('GeoIp.dat', data.value)
  data.value = await parseGeoFile(
    'geosite',
    'https://gh-proxy.org/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/release/geosite.dat',
  )
  console.log('GeoSite.dat', data.value)
})
</script>

<template></template>

<style scoped></style>
