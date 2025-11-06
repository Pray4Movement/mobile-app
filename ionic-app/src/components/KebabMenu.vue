<template>
  <ion-button fill="clear" ref="trigger" @click="presentPopover">
    <ion-icon :icon="ellipsisVertical" />
  </ion-button>
  <ion-popover
    :is-open="isOpen"
    @didDismiss="isOpen = false"
    :trigger="trigger"
  >
    <ion-content>
      <ion-list>
        <ion-item button @click="handleAction('unsubscribe')" v-if="showUnsubscribe">
          <ion-label>Unsubscribe</ion-label>
        </ion-item>
        <ion-item button @click="handleAction('changeLanguage')" v-if="showChangeLanguage">
          <ion-label>Change Language</ion-label>
        </ion-item>
        <ion-item button @click="handleAction('share')" v-if="showShare">
          <ion-label>Share</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonIcon, IonPopover, IonContent, IonList, IonItem, IonLabel } from '@ionic/vue';
import { ellipsisVertical } from 'ionicons/icons';

const props = withDefaults(defineProps<{
  showUnsubscribe?: boolean;
  showChangeLanguage?: boolean;
  showShare?: boolean;
}>(), {
  showUnsubscribe: true,
  showChangeLanguage: true,
  showShare: true,
});

const emit = defineEmits<{
  action: [action: string];
}>();

const isOpen = ref(false);
const trigger = ref();

const presentPopover = () => {
  isOpen.value = true;
};

const handleAction = (action: string) => {
  isOpen.value = false;
  emit('action', action);
};
</script>

