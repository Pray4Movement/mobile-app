<template>
  <ion-card @click="$emit('click')" :class="{ 'subscribed': subscribed }">
    <ion-card-header>
      <ion-card-title>
        {{ campaign.name }}
        <ion-badge v-if="subscribed" color="success" style="margin-left: 8px;">
          <ion-icon :icon="checkmarkCircle" style="margin-right: 4px;" />
          Subscribed
        </ion-badge>
      </ion-card-title>
      <ion-card-subtitle>
        <ion-badge v-for="lang in campaign.languages.slice(0, 3)" :key="lang" color="light" style="margin-right: 4px;">
          {{ lang.toUpperCase() }}
        </ion-badge>
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <p>{{ campaign.shortDescription }}</p>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonIcon } from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';
import type { Campaign } from '../data/campaigns';

defineProps<{
  campaign: Campaign;
  subscribed?: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
ion-card {
  cursor: pointer;
  margin: 8px;
}

ion-card:hover {
  opacity: 0.9;
}

ion-card.subscribed {
  border-left: 4px solid var(--ion-color-success);
  background-color: rgba(45, 211, 111, 0.05);
}

ion-card-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>

