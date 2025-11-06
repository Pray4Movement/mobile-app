<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Campaigns</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Campaigns</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container">
        <ion-button expand="block" @click="router.push('/campaign-chooser')" class="find-button">
          <ion-icon :icon="addOutline" slot="start" />
          Find New Campaign
        </ion-button>

        <div v-if="subscribedCampaigns.length === 0" class="empty-state">
          <ion-icon :icon="bookOutline" size="large" />
          <p>No campaigns subscribed</p>
          <p class="subtitle">Find and subscribe to prayer campaigns</p>
        </div>

        <ion-list v-else>
          <ion-item
            v-for="campaign in subscribedCampaigns"
            :key="campaign.id"
            lines="full"
          >
            <ion-label>
              <h2>{{ campaign.name }}</h2>
              <p>{{ campaign.shortDescription }}</p>
              <p>
                <ion-badge color="light">{{ getSubscriptionLanguage(campaign.id) }}</ion-badge>
              </p>
            </ion-label>
            <KebabMenu
              slot="end"
              @action="(action) => handleAction(action, campaign.id)"
            />
          </ion-item>
        </ion-list>

        <ion-alert
          :is-open="showUnsubscribeAlert"
          :header="'Unsubscribe from ' + unsubscribeCampaignName"
          message="Are you sure you want to unsubscribe from this campaign?"
          :buttons="alertButtons"
          @didDismiss="showUnsubscribeAlert = false"
        />

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
                v-for="lang in getAvailableLanguages(languageModalCampaignId)"
                :key="lang.code"
                button
                @click="handleLanguageChange(languageModalCampaignId, lang.code)"
              >
                <ion-label>{{ lang.name }}</ion-label>
                <ion-icon
                  v-if="getSubscriptionLanguage(languageModalCampaignId) === lang.code"
                  :icon="checkmark"
                  slot="end"
                  color="primary"
                />
              </ion-item>
            </ion-list>
          </ion-content>
        </ion-modal>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonAlert,
  IonModal,
  IonButtons,
} from '@ionic/vue';
import { addOutline, bookOutline, checkmark } from 'ionicons/icons';
import { useSubscriptions } from '../composables/useSubscriptions';
import { usePreferences } from '../composables/usePreferences';
import { getCampaignById } from '../data/campaigns';
import { shareCampaign } from '../utils/share';
import KebabMenu from '../components/KebabMenu.vue';

const router = useRouter();
const { subscriptions, unsubscribe, getSubscription, updateLanguage } = useSubscriptions();
const { setCampaignLanguage } = usePreferences();

const showUnsubscribeAlert = ref(false);
const unsubscribeCampaignId = ref<string>('');
const unsubscribeCampaignName = ref('');
const showLanguageModal = ref(false);
const languageModalCampaignId = ref<string>('');

const subscribedCampaigns = computed(() => {
  return subscriptions.value
    .map(sub => getCampaignById(sub.campaignId))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
});

const getSubscriptionLanguage = (campaignId: string): string => {
  const sub = getSubscription(campaignId);
  return sub?.language || 'en';
};

const getAvailableLanguages = (campaignId: string) => {
  const campaign = getCampaignById(campaignId);
  if (!campaign) return [];
  return campaign.languages.map(code => ({
    code,
    name: code.toUpperCase(),
  }));
};

const handleAction = async (action: string, campaignId: string) => {
  const campaign = getCampaignById(campaignId);
  if (!campaign) return;

  switch (action) {
    case 'unsubscribe':
      unsubscribeCampaignId.value = campaignId;
      unsubscribeCampaignName.value = campaign.name;
      showUnsubscribeAlert.value = true;
      break;
    case 'changeLanguage':
      languageModalCampaignId.value = campaignId;
      showLanguageModal.value = true;
      break;
    case 'share':
      await shareCampaign(campaign.name, campaign.code);
      break;
  }
};

const alertButtons = [
  {
    text: 'Cancel',
    role: 'cancel',
  },
  {
    text: 'Unsubscribe',
    role: 'destructive',
    handler: () => {
      unsubscribe(unsubscribeCampaignId.value);
    },
  },
];

const handleLanguageChange = (campaignId: string, language: string) => {
  setCampaignLanguage(campaignId, language);
  updateLanguage(campaignId, language);
  showLanguageModal.value = false;
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.find-button {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: var(--ion-color-medium);
}

.empty-state .subtitle {
  font-size: 14px;
  margin-top: 8px;
}
</style>

