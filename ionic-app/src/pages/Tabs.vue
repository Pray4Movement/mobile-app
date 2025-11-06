<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="prayer-feed" href="/tabs/prayer-feed">
          <ion-icon :icon="bookOutline" />
          <ion-label>Prayer Feed</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="campaigns" href="/tabs/campaigns">
          <ion-icon :icon="listOutline" />
          <ion-label>Campaigns</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { bookOutline, listOutline } from 'ionicons/icons';
</script>

