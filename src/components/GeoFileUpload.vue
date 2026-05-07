<template>
  <div class="upload-container">
    <el-upload
      class="upload-area"
      drag
      :auto-upload="false"
      :show-file-list="false"
      accept=".dat"
      :on-change="handleFileChange"
    >
      <div class="upload-content">
        <el-icon class="upload-icon" size="50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 40a408 408 0 0 0-408 408h816A408 408 0 0 0 512 104"
            ></path>
            <path
              fill="currentColor"
              d="M512 220.8a29.12 29.12 0 0 1 20.48 8.32l185.6 185.6a25.6 25.6 0 0 1-36.48 36.48L537.6 307.2V608a25.6 25.6 0 0 1-51.2 0V307.2L422.4 451.2a25.6 25.6 0 1 1-36.48-36.48l185.6-185.6A29.12 29.12 0 0 1 512 220.8"
            ></path>
          </svg>
        </el-icon>
        <div class="upload-text">
          <div class="upload-title">点击上传或拖拽文件到此处</div>
          <div class="upload-desc">支持 .dat 文件格式</div>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { parseGeoFile } from '@/util/GeoUtil'
import type { GeoIPList } from '@/types/GeoIP'
import type { GeoSiteList } from '@/types/GeoSite'

interface Props {
  type?: 'geoip' | 'geosite'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'geosite',
})

// 定义 emits
const emit = defineEmits<{
  'file-loaded': [data: GeoIPList | GeoSiteList, type: 'geoip' | 'geosite']
}>()

// 处理文件变化
const handleFileChange = async (file: any) => {
  if (!file.raw) {
    return
  }

  const rawFile = file.raw
  if (!rawFile.name.endsWith('.dat')) {
    ElMessage.error('请选择 .dat 文件')
    return
  }

  try {
    // 读取文件内容
    const arrayBuffer = await rawFile.arrayBuffer()

    // 创建Blob URL来访问文件内容
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)

    // 尝试检测文件类型
    let detectedType: 'geoip' | 'geosite' = props.type

    // 检测文件类型 by 检查内容
    const uint8Array = new Uint8Array(arrayBuffer.slice(0, 1000)) // 只检查前1000个字节
    const decoder = new TextDecoder()
    const textContent = decoder.decode(uint8Array)

    if (textContent.includes('geoip')) {
      detectedType = 'geoip'
    } else if (textContent.includes('geosite')) {
      detectedType = 'geosite'
    }

    // 解析文件
    const parsedData = await parseGeoFile(detectedType, url)

    // 释放对象URL
    URL.revokeObjectURL(url)

    // 发射事件通知父组件
    emit('file-loaded', parsedData!, detectedType)

    ElMessage.success('文件上传并解析成功！')
  } catch (error) {
    console.error('解析文件失败:', error)
    ElMessage.error('文件解析失败，请确认文件格式正确')
  }
}
</script>

<style scoped>
.upload-container {
  width: 100%;
}

.upload-area {
  width: 100%;
}

.upload-content {
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  color: #c0c4cc;
  margin-bottom: 1rem;
}

.upload-title {
  font-size: 1rem;
  color: #606266;
  margin-bottom: 0.5rem;
}

.upload-desc {
  font-size: 0.8rem;
  color: #909399;
}
</style>
