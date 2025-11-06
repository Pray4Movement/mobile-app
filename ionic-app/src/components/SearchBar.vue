<template>
  <ion-searchbar
    :value="searchTerm"
    @ionInput="handleInput"
    placeholder="Search campaigns..."
    :debounce="300"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonSearchbar } from '@ionic/vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const searchTerm = ref(props.modelValue);

const handleInput = (event: CustomEvent) => {
  const value = (event.target as HTMLIonSearchbarElement).value || '';
  searchTerm.value = value;
  emit('update:modelValue', value);
};
</script>

