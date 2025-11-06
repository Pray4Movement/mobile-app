<template>
  <div class="content-renderer">
    <template v-for="(block, index) in blocks" :key="index">
      <h1 v-if="block.type === 'heading' && block.level === 1" class="heading-1">
        {{ block.content }}
      </h1>
      <h2 v-else-if="block.type === 'heading' && block.level === 2" class="heading-2">
        {{ block.content }}
      </h2>
      <h3 v-else-if="block.type === 'heading' && block.level === 3" class="heading-3">
        {{ block.content }}
      </h3>
      <p v-else-if="block.type === 'paragraph'" class="paragraph">
        {{ block.content }}
      </p>
      <ul v-else-if="block.type === 'list'" class="list">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">{{ item }}</li>
      </ul>
      <img
        v-else-if="block.type === 'image' && block.src"
        :src="block.src"
        :alt="block.alt || ''"
        class="image"
      />
      <ion-button
        v-else-if="block.type === 'button'"
        :color="block.action === 'primary' ? 'primary' : 'medium'"
        @click="$emit('buttonClick', block.action)"
      >
        {{ block.text }}
      </ion-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import type { Block } from '../data/fuel';

defineProps<{
  blocks: Block[];
}>();

defineEmits<{
  buttonClick: [action?: string];
}>();
</script>

<style scoped>
.content-renderer {
  padding: 16px;
}

.heading-1 {
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0 8px 0;
}

.heading-2 {
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0 6px 0;
}

.heading-3 {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 5px 0;
}

.paragraph {
  margin: 8px 0;
  line-height: 1.6;
}

.list {
  margin: 8px 0;
  padding-left: 24px;
}

.list li {
  margin: 4px 0;
  line-height: 1.6;
}

.image {
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 16px 0;
  border-radius: 8px;
}
</style>

