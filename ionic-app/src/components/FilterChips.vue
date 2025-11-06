<template>
  <div class="filter-chips">
    <ion-chip
      v-for="option in options"
      :key="option.id"
      :outline="!isSelected(option.id)"
      :color="isSelected(option.id) ? 'primary' : 'medium'"
      @click="toggle(option.id)"
    >
      {{ option.label }}
    </ion-chip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonChip } from '@ionic/vue';

interface Option {
  id: string;
  label: string;
}

const props = defineProps<{
  options: Option[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const isSelected = (id: string): boolean => {
  return props.modelValue.includes(id);
};

const toggle = (id: string) => {
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(id);
  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(id);
  }
  emit('update:modelValue', newValue);
};
</script>

<style scoped>
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
}
</style>

