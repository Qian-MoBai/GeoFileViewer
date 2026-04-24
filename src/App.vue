<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { parseGeoFile } from '@/util/GeoUtil'
const data = ref({})
onMounted(async () => {
  data.value = await parseGeoFile()
})
</script>

<template>
  {{ data }}
</template>

<style scoped></style>
