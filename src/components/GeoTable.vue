<script setup lang="ts">
import type { GeoIPList } from '@/types/GeoIP'
import type { GeoSiteList } from '@/types/GeoSite'

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
        <el-collapse-item
          v-for="(item, index) in paginatedData"
          :key="index"
          :title="item.countryCode"
        >
          <el-table v-if="type === 'geoip'" :data="item.cidr" :show-header="false">
            <el-table-column prop="cidr">
              <template #default="scope"> {{ scope.row.ip }}/{{ scope.row.prefix }} </template>
            </el-table-column>
          </el-table>
          <el-table v-else :data="item.domain" :show-header="false">
            <el-table-column prop="type">
              <template #default="scope">
                <el-tag>
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
