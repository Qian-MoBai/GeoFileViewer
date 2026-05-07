<script setup lang="ts">
import type { GeoIP, GeoIPList } from '@/types/GeoIP'
import type { GeoSite, GeoSiteList } from '@/types/GeoSite'

interface Props {
  type: 'geoip' | 'geosite'
  data: GeoSiteList | GeoIPList | null
}

const props = withDefaults(defineProps<Props>(), {
  type: 'geosite',
  data: null,
})

// 搜索状态
const searchQuery = ref('')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 总条数
const total = computed(() => filteredData.value?.length ?? 0)

// 过滤后的数据
const filteredData = computed(() => {
  if (!props.data?.entry) return []

  if (!searchQuery.value) {
    return props.data.entry
  }

  const query = searchQuery.value.toLowerCase()

  if (props.type === 'geoip') {
    return (props.data.entry as GeoIP[]).filter(
      (item) =>
        item.countryCode.toLowerCase().includes(query) ||
        (item as GeoIP).cidr.some(
          (cidr) => cidr.ip.toLowerCase().includes(query) || String(cidr.prefix).includes(query),
        ),
    )
  } else {
    return (props.data.entry as GeoSite[]).filter(
      (item) =>
        item.countryCode.toLowerCase().includes(query) ||
        (item as GeoSite).domain.some(
          (domain) =>
            domain.value.toLowerCase().includes(query) ||
            (domain.type && domain.type.toLowerCase().includes(query)),
        ),
    )
  }
})

// 当前页数据
const paginatedData = computed(() => {
  if (!filteredData.value) return []
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

watch(
  () => props.data,
  () => {
    currentPage.value = 1
    searchQuery.value = ''
  },
)
</script>

<template>
  <el-container>
    <el-header>
      <div style="display: flex; justify-content: center; margin-bottom: 16px">
        <el-input
          v-model="searchQuery"
          placeholder="搜索国家代码或内容..."
          clearable
          style="max-width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="prev, pager, next, sizes"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        :hide-on-single-page="true"
        style="margin-bottom: 16px"
      />
    </el-header>
    <el-main>
      <el-collapse>
        <el-collapse-item v-for="(item, index) in paginatedData" :key="index">
          <template #title>
            {{ item.countryCode }}
            <el-tag type="info" size="small">
              {{
                type === 'geoip' ? (item as GeoIP).cidr.length : (item as GeoSite).domain.length
              }}&nbsp;条
            </el-tag>
          </template>
          <el-scrollbar max-height="300px">
            <!-- geoip 类型的展示 -->
            <p v-if="type === 'geoip'">
              <el-tag v-for="cidr in (item as GeoIP).cidr">
                {{ cidr.ip }}/{{ cidr.prefix }}
              </el-tag>
            </p>
            <!-- geosite 类型的展示 -->
            <p v-else v-for="domain in (item as GeoSite).domain">
              <el-tag v-if="domain.type === 'Plain'" class="plain">
                {{ domain.type }}
              </el-tag>
              <el-tag v-else-if="domain.type === 'Regex'" class="regex">
                {{ domain.type }}
              </el-tag>
              <el-tag v-else-if="domain.type === 'RootDomain'" class="rootDomain">
                {{ domain.type }}
              </el-tag>
              <el-tag v-else-if="domain.type === 'Full'" class="full"> {{ domain.type }} </el-tag>
              &emsp;{{ domain.value }}
            </p>
          </el-scrollbar>
        </el-collapse-item>
      </el-collapse>
    </el-main>
    <el-footer>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        layout="prev, pager, next, sizes"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        :hide-on-single-page="true"
        style="margin-top: 16px"
      />
    </el-footer>
  </el-container>
</template>
<style scoped lang="scss">
:deep(.el-tag) {
  &.plain {
    background-color: #dbeafe;
    color: #1e40af;
  }
  &.regex {
    background-color: #f3e8ff;
    color: #6b21a8;
  }
  &.rootDomain {
    background-color: #dcfce7;
    color: #15803d;
  }
  &.full {
    background-color: #fff7ed;
    color: #9a3412;
  }
}
</style>
