<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="defaultBackRoute" />
        </ion-buttons>
        <ion-title>Choose a Campaign</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleCancel">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Choose a Campaign</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container">
        <SearchBar v-model="searchTerm" />

        <ion-item>
          <ion-label position="stacked">Campaign Code</ion-label>
          <ion-input
            v-model="campaignCode"
            placeholder="Enter campaign code"
            @ionInput="handleCodeInput"
          />
        </ion-item>

        <div class="section">
          <h3>Filter by Group</h3>
          <FilterChips
            :options="groupOptions"
            v-model="selectedGroups"
          />
        </div>

        <div class="section">
          <h3>Filter by Language</h3>
          <FilterChips
            :options="languageOptions"
            v-model="selectedLanguages"
          />
        </div>

        <div class="count">
          Showing {{ filteredCampaigns.length }} of {{ campaigns.length }} campaigns
        </div>

        <div v-if="filteredCampaigns.length === 0" class="empty-state">
          <ion-icon :icon="searchOutline" size="large" />
          <p>No campaigns found</p>
        </div>

        <div v-else>
          <div v-for="group in groupedCampaigns" :key="group.id" class="group-section">
            <h2>{{ group.name }}</h2>
            <CampaignCard
              v-for="campaign in group.campaigns"
              :key="campaign.id"
              :campaign="campaign"
              :subscribed="isSubscribed(campaign.id)"
              @click="handleCampaignClick(campaign)"
            />
          </div>
        </div>
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
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonButtons,
  IonButton,
  IonBackButton,
} from '@ionic/vue';
import { searchOutline, closeOutline } from 'ionicons/icons';
import { campaigns, getCampaignsByGroup, getCampaignByCode } from '../data/campaigns';
import { groups } from '../data/groups';
import { languages } from '../data/languages';
import { useSubscriptions } from '../composables/useSubscriptions';
import SearchBar from '../components/SearchBar.vue';
import FilterChips from '../components/FilterChips.vue';
import CampaignCard from '../components/CampaignCard.vue';

const router = useRouter();
const { subscribe, isSubscribed, subscriptions } = useSubscriptions();

const defaultBackRoute = computed(() => {
  // If user has subscriptions, go to campaigns tab, otherwise go to prayer feed
  return subscriptions.value.length > 0 ? '/tabs/campaigns' : '/tabs/prayer-feed';
});

const handleCancel = () => {
  if (subscriptions.value.length > 0) {
    router.push('/tabs/campaigns');
  } else {
    router.push('/tabs/prayer-feed');
  }
};

const searchTerm = ref('');
const campaignCode = ref('');
const selectedGroups = ref<string[]>([]);
const selectedLanguages = ref<string[]>([]);

const groupOptions = groups.map(g => ({ id: g.id, label: g.name }));
const languageOptions = languages.map(l => ({ id: l.code, label: l.name }));

const filteredCampaigns = computed(() => {
  let result = [...campaigns];

  // Filter by campaign code if provided
  if (campaignCode.value.trim()) {
    const codeMatch = getCampaignByCode(campaignCode.value.trim());
    if (codeMatch) {
      return [codeMatch];
    }
    return [];
  }

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.shortDescription.toLowerCase().includes(term)
    );
  }

  // Filter by groups
  if (selectedGroups.value.length > 0) {
    result = result.filter(c => selectedGroups.value.includes(c.groupId));
  }

  // Filter by languages
  if (selectedLanguages.value.length > 0) {
    result = result.filter(c =>
      c.languages.some(lang => selectedLanguages.value.includes(lang))
    );
  }

  return result;
});

const groupedCampaigns = computed(() => {
  const grouped: Array<{ id: string; name: string; campaigns: typeof campaigns }> = [];
  const groupMap = new Map<string, typeof campaigns>();

  filteredCampaigns.value.forEach(campaign => {
    if (!groupMap.has(campaign.groupId)) {
      groupMap.set(campaign.groupId, []);
    }
    groupMap.get(campaign.groupId)!.push(campaign);
  });

  groups.forEach(group => {
    const groupCampaigns = groupMap.get(group.id);
    if (groupCampaigns && groupCampaigns.length > 0) {
      grouped.push({
        id: group.id,
        name: group.name,
        campaigns: groupCampaigns,
      });
    }
  });

  return grouped;
});

const handleCodeInput = () => {
  // Clear other filters when code is entered
  if (campaignCode.value.trim()) {
    searchTerm.value = '';
    selectedGroups.value = [];
    selectedLanguages.value = [];
  }
};

const handleCampaignClick = (campaign: typeof campaigns[0]) => {
  if (!isSubscribed(campaign.id)) {
    subscribe(campaign.id, campaign.languages[0] || 'en');
  }
  router.push('/tabs/prayer-feed');
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.section {
  margin: 16px 0;
}

.section h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.count {
  margin: 16px 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: var(--ion-color-medium);
}

.group-section {
  margin: 24px 0;
}

.group-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  padding: 0 8px;
}
</style>

