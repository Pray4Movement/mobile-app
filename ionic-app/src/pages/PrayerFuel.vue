<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/prayer-feed" />
        </ion-buttons>
        <ion-title>{{ campaignName }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleShare">
            <ion-icon :icon="shareOutline" />
          </ion-button>
          <ion-button @click="showLanguageModal = true">
            <ion-icon :icon="languageOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container" v-if="fuelItem">
        <JsonContentRenderer :blocks="fuelItem.blocks" />

        <div class="actions">
          <ion-button
            :expand="'block'"
            :color="isPrayed(campaignId, dateISO) ? 'success' : 'primary'"
            @click="handlePrayed"
          >
            <ion-icon v-if="isPrayed(campaignId, dateISO)" :icon="checkmarkCircle" slot="start" />
            {{ isPrayed(campaignId, dateISO) ? '✓ Prayed' : 'I prayed' }}
          </ion-button>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Prayer fuel not found</p>
        <ion-button @click="router.back()">Go Back</ion-button>
      </div>

      <ion-modal :is-open="showLanguageModal" @didDismiss="showLanguageModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Change Language</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showLanguageModal = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item
              v-for="lang in availableLanguages"
              :key="lang.code"
              button
              @click="handleLanguageChange(lang.code)"
            >
              <ion-label>{{ lang.name }}</ion-label>
              <ion-icon
                v-if="currentLanguage === lang.code"
                :icon="checkmark"
                slot="end"
                color="primary"
              />
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import { shareOutline, languageOutline, checkmarkCircle, checkmark } from 'ionicons/icons';
import { getFuelByCampaignAndDate } from '../data/fuel';
import { getCampaignById } from '../data/campaigns';
import { useSubscriptions } from '../composables/useSubscriptions';
import { usePreferences } from '../composables/usePreferences';
import { usePrayed } from '../composables/usePrayed';
import { shareCampaign } from '../utils/share';
import JsonContentRenderer from '../components/JsonContentRenderer.vue';

const route = useRoute();
const router = useRouter();
const { getSubscription, updateLanguage } = useSubscriptions();
const { getCampaignLanguage, setCampaignLanguage } = usePreferences();
const { isPrayed, markAsPrayed } = usePrayed();

const campaignId = route.params.campaignId as string;
const dateISO = route.params.dateISO as string;

const fuelItem = computed(() => getFuelByCampaignAndDate(campaignId, dateISO));
const campaign = computed(() => getCampaignById(campaignId));
const campaignName = computed(() => campaign.value?.name || 'Prayer Fuel');

const showLanguageModal = ref(false);
const currentLanguage = computed(() => {
  const sub = getSubscription(campaignId);
  return sub?.language || getCampaignLanguage(campaignId) || 'en';
});

const availableLanguages = computed(() => {
  if (!campaign.value) return [];
  // In a real app, this would fetch available languages from API
  // For now, use the campaign's supported languages
  return campaign.value.languages.map(code => ({
    code,
    name: code.toUpperCase(),
  }));
});

const handleShare = async () => {
  if (campaign.value) {
    await shareCampaign(campaign.value.name, campaign.value.code);
  }
};

const handleLanguageChange = (language: string) => {
  setCampaignLanguage(campaignId, language);
  updateLanguage(campaignId, language);
  showLanguageModal.value = false;
};

const handlePrayed = () => {
  if (!isPrayed(campaignId, dateISO)) {
    markAsPrayed(campaignId, dateISO);
  }
  router.push('/tabs/prayer-feed');
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.actions {
  margin-top: 32px;
  padding-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: var(--ion-color-medium);
}
</style>

