<script setup lang="ts">
import type { GeoIP, GeoIPList } from '@/types/GeoIP'
import type { GeoSite, GeoSiteList } from '@/types/GeoSite'
import { Search } from '@element-plus/icons-vue'

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
  <div v-if="!data" class="no-data">
    <el-empty description="暂无数据，请先上传文件或选择数据源" />
  </div>

  <div v-else class="table-container">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      "
    >
      <h3>{{ type === 'geoip' ? 'GeoIP (IP规则)' : 'GeoSite (域名规则)' }} 数据</h3>
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
      layout="prev, pager, next, sizes, total"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      :hide-on-single-page="true"
      style="margin-bottom: 16px"
    />

    <el-collapse>
      <el-collapse-item
        v-for="(item, index) in paginatedData"
        :key="index"
        :title="`${item.countryCode} (${type === 'geoip' ? (item as GeoIP).cidr.length : (item as GeoSite).domain.length} 条)`"
      >
        <el-scrollbar max-height="300px">
          <!-- geoip 类型的展示 -->
          <div v-if="type === 'geoip'">
            <p>
              <el-tag
                v-for="(cidr, idx) in (item as GeoIP).cidr"
                :key="'cidr-' + idx"
                type="success"
              >
                {{ cidr.ip }}/{{ cidr.prefix }}
              </el-tag>
            </p>
            <div v-if="!(item as GeoIP).cidr.length" class="no-content">该分类下暂无数据</div>
          </div>

          <!-- geosite 类型的展示 -->
          <div v-else>
            <p
              v-for="(domain, idx) in (item as GeoSite).domain"
              :key="'domain-' + idx"
              class="data-item"
            >
              <el-tag
                :class="
                  domain.type === 'Plain'
                    ? 'plain'
                    : domain.type === 'Regex'
                      ? 'regex'
                      : domain.type === 'RootDomain'
                        ? 'rootDomain'
                        : 'full'
                "
                size="small"
              >
                {{ domain.type }}
              </el-tag>
              <span class="domain-value">{{ domain.value }}</span>
            </p>
            <div v-if="!(item as GeoSite).domain.length" class="no-content">该分类下暂无数据</div>
          </div>
        </el-scrollbar>
      </el-collapse-item>
    </el-collapse>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      layout="prev, pager, next, sizes, total"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      :hide-on-single-page="true"
      style="margin-top: 16px; text-align: right"
    />
  </div>
</template>

<style scoped lang="scss">
.table-container {
  padding: 16px;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.data-item {
  display: block;
  margin-bottom: 8px;
  word-break: break-all;
}

.domain-value {
  margin-left: 8px;
}

.no-content {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

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
