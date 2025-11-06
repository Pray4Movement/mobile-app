<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Prayer Feed</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="router.push('/reminder-editor')">
            <ion-icon :icon="settingsOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Prayer Feed</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container">
        <ion-card v-if="reminders.length > 0" class="reminder-summary">
          <ion-card-header>
            <ion-card-title>Reminder Schedule</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p v-for="reminder in reminders" :key="reminder.id">
              {{ reminder.label }}: {{ formatReminderSchedule(reminder) }}
            </p>
            <ion-button fill="clear" size="small" @click="router.push('/reminder-editor')">
              Edit Reminders
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card v-else class="reminder-summary">
          <ion-card-content>
            <p>No reminders set</p>
            <ion-button fill="clear" size="small" @click="router.push('/reminder-editor')">
              Create Reminder
            </ion-button>
          </ion-card-content>
        </ion-card>

        <div v-if="feedItems.length === 0" class="empty-state">
          <ion-icon :icon="bookOutline" size="large" />
          <p>No prayer fuel available</p>
          <p class="subtitle">Subscribe to campaigns to see prayer content</p>
          <ion-button @click="router.push('/campaign-chooser')">
            Find Campaigns
          </ion-button>
        </div>

        <div v-else>
          <div v-for="(items, date) in groupedByDate" :key="date" class="date-section">
            <h2>{{ formatDate(date) }}</h2>
            <ion-card
              v-for="item in items"
              :key="item.id"
              :class="{ 'prayed': isPrayed(item.campaignId, item.dateISO) }"
              @click="router.push(`/prayer-fuel/${item.campaignId}/${item.dateISO}`)"
            >
              <ion-card-header>
                <ion-card-title>
                  {{ getCampaignName(item.campaignId) }}
                  <ion-icon v-if="isPrayed(item.campaignId, item.dateISO)" :icon="checkmarkCircle" color="success" />
                </ion-card-title>
                <ion-card-subtitle>{{ formatDate(item.dateISO) }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <p>{{ getShortDescription(item) }}</p>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/vue';
import { settingsOutline, bookOutline, checkmarkCircle } from 'ionicons/icons';
import { useSubscriptions } from '../composables/useSubscriptions';
import { useReminders } from '../composables/useReminders';
import { usePrayed } from '../composables/usePrayed';
import { getFuelByCampaign } from '../data/fuel';
import { getCampaignById } from '../data/campaigns';
import { formatDate } from '../utils/date';
import { getTodayISO } from '../utils/date';

const router = useRouter();
const { subscriptions } = useSubscriptions();
const { reminders } = useReminders();
const { isPrayed } = usePrayed();

const feedItems = computed(() => {
  const items: Array<{
    id: string;
    campaignId: string;
    dateISO: string;
  }> = [];

  subscriptions.value.forEach(sub => {
    const fuel = getFuelByCampaign(sub.campaignId);
    // Show next 7 days
    const today = getTodayISO();
    const todayDate = new Date(today);
    for (let i = 0; i < 7; i++) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() + i);
      const dateISO = date.toISOString().split('T')[0];
      const fuelItem = fuel.find(f => f.dateISO === dateISO);
      if (fuelItem) {
        items.push({
          id: fuelItem.id,
          campaignId: fuelItem.campaignId,
          dateISO: fuelItem.dateISO,
        });
      }
    }
  });

  return items.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
});

const groupedByDate = computed(() => {
  const grouped: Record<string, typeof feedItems.value> = {};
  feedItems.value.forEach(item => {
    if (!grouped[item.dateISO]) {
      grouped[item.dateISO] = [];
    }
    grouped[item.dateISO].push(item);
  });
  return grouped;
});

const getCampaignName = (campaignId: string): string => {
  const campaign = getCampaignById(campaignId);
  return campaign?.name || 'Unknown Campaign';
};

const getShortDescription = (item: typeof feedItems.value[0]): string => {
  const campaign = getCampaignById(item.campaignId);
  return campaign?.shortDescription || '';
};

const formatReminderSchedule = (reminder: ReturnType<typeof useReminders>['reminders']['value'][0]): string => {
  const days = reminder.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ');
  const times = reminder.times.join(', ');
  return `${days} at ${times}`;
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.reminder-summary {
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

.date-section {
  margin: 24px 0;
}

.date-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  padding: 0 8px;
}

ion-card {
  margin: 8px 0;
  cursor: pointer;
}

ion-card.prayed {
  opacity: 0.7;
  border-left: 4px solid var(--ion-color-success);
}

ion-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

