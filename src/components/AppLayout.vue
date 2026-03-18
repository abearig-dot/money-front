<template>
  <view class="app-layout" :class="themeClass">
    <slot />
    <RecordActionSheet ref="recordSheetRef" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/hooks/useTheme'
import RecordActionSheet from '@/components/RecordActionSheet.vue'

const { themeClass } = useTheme()
const recordSheetRef = ref<InstanceType<typeof RecordActionSheet> | null>(null)

onMounted(() => {
  // 只需要保留这一个监听即可
  uni.$on('open-record-sheet', () => {
    if (recordSheetRef.value) {
      recordSheetRef.value.open()
    }
  })
})

onUnmounted(() => {
  uni.$off('open-record-sheet')
})
</script>