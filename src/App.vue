<script setup lang="ts">
import { parseGeoFile } from '@/util/GeoUtil'
import type { GeoIPList } from '@/types/GeoIP'
import type { GeoSiteList } from '@/types/GeoSite'
import { ElMessage } from 'element-plus'
import GeoTable from '@/components/GeoTable.vue'
const title = ref('')
const loading = ref(false)
const data: Ref<GeoIPList | GeoSiteList | null> = ref(null)
const type: Ref<'geoip' | 'geosite'> = ref('geosite')
const origin = ref([
  {
    lable: 'Loyalsoldier/v2ray-rules-dat',
    value: 'https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release',
  },
  {
    lable: 'MetaCubeX/meta-rules-dat',
    value: 'https://testingcf.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release',
  },
])
const originData = ref('')
const selectHandler = async () => {
  ElMessage.info('开始解析')
  loading.value = true
  try {
    data.value = await parseGeoFile(type.value, `${originData.value}/${type.value}.dat`)
    ElMessage.success('解析完成')
    loading.value = false
  } catch (e) {
    ElMessage.error(`解析失败,${e}`)
  }
}
onMounted(() => {
  title.value = document.title
})
</script>

<template>
  <el-container>
    <el-header>
      <el-image src="/favicon.svg" />
      {{ title }}
    </el-header>
    <el-container>
      <el-aside width="30%">
        <el-card header="预设数据源" shadow="always">
          <el-radio-group v-model="originData" @change="selectHandler">
            <el-radio-button v-for="(item, index) in origin" :key="index" :value="item.value">{{
              item.lable
            }}</el-radio-button>
          </el-radio-group>
        </el-card>
        <el-card header="选择数据类型" shadow="always">
          <el-radio-group v-model="type" @change="selectHandler">
            <el-radio value="geoip">GeoIP</el-radio>
            <el-radio value="geosite">GeoSite</el-radio>
          </el-radio-group>
        </el-card>
      </el-aside>
      <el-main>
        <el-card header="解析内容" shadow="always" v-loading="loading">
          <geo-table :data="data" :type="type" />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
:deep(.el-image) {
  width: 32px;
  height: 32px;
}
</style>
