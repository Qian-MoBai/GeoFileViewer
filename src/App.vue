<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { parseGeoFile } from '@/util/GeoUtil'
import type { GeoIPList } from '@/types/GeoIP'
import type { GeoSiteList } from '@/types/GeoSite'
import { ElMessage } from 'element-plus'
const data: Ref<GeoIPList | GeoSiteList | null> = ref(null)
const type: Ref<'geoip' | 'geosite'> = ref('geosite')
const origin = ref([
  {
    lable: 'Loyalsoldier/v2ray-rules-dat',
    value: 'https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release',
  },
  {
    lable: 'MetaCubeX/meta-rules-dat',
    value: 'https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release',
  },
])
const originData = ref('')
const selectHandler = async () => {
  ElMessage.info('开始解析')
  try {
    data.value = await parseGeoFile(type.value, `${originData.value}/${type.value}.dat`)
    ElMessage.success('解析完成')
  } catch (e) {
    ElMessage.error(`解析失败,${e}`)
  }
}
</script>

<template>
  <el-card header="预设数据源">
    <el-radio-group v-model="originData">
      <el-radio-button v-for="(item, index) in origin" :key="index" :value="item.value">{{
        item.lable
      }}</el-radio-button>
    </el-radio-group>
  </el-card>
  <el-radio-group v-model="type">
    <el-radio-button value="geoip">GeoIP</el-radio-button>
    <el-radio-button value="geosite">GeoSite</el-radio-button>
  </el-radio-group>
  <el-button type="primary" :round="true" @click="selectHandler">解析</el-button>
</template>

<style scoped></style>
