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

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 总条数
const total = computed(() => props.data?.entry?.length ?? 0)

// 当前页数据
const paginatedData = computed(() => {
  if (!props.data?.entry) return []
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.data.entry.slice(start, end)
})

watch(
  () => props.data,
  () => {
    currentPage.value = 1
  },
)
</script>

<template>
  <el-container>
    <el-header>
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
          <!-- geoip 类型的展示 -->
          <el-table v-if="type === 'geoip'" :data="(item as GeoIP).cidr" :show-header="false">
            <el-table-column prop="cidr">
              <template #default="scope">
                <el-tag type="success"> {{ scope.row.ip }}/{{ scope.row.prefix }} </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <!-- geosite 类型的展示 -->
          <el-table v-else :data="(item as GeoSite).domain" :show-header="false">
            <el-table-column prop="type">
              <template #default="scope">
                <el-tag v-if="scope.row.type === 'Plain'" class="plain">
                  {{ scope.row.type }}
                </el-tag>
                <el-tag v-else-if="scope.row.type === 'Regex'" class="regex">
                  {{ scope.row.type }}
                </el-tag>
                <el-tag v-else-if="scope.row.type === 'RootDomain'" class="rootDomain">
                  {{ scope.row.type }}
                </el-tag>
                <el-tag v-else-if="scope.row.type === 'Full'" class="full">
                  {{ scope.row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="value" />
          </el-table>
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
