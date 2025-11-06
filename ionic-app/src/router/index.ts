import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { hasSubscriptions } from '../utils/subscriptions';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: () => {
      return hasSubscriptions() ? '/tabs/prayer-feed' : '/campaign-chooser';
    },
  },
  {
    path: '/campaign-chooser',
    name: 'CampaignChooser',
    component: () => import('../pages/CampaignChooser.vue'),
  },
  {
    path: '/tabs/',
    component: () => import('../pages/Tabs.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/prayer-feed',
      },
      {
        path: 'prayer-feed',
        name: 'PrayerFeed',
        component: () => import('../pages/PrayerFeed.vue'),
      },
      {
        path: 'campaigns',
        name: 'Campaigns',
        component: () => import('../pages/Campaigns.vue'),
      },
    ],
  },
  {
    path: '/prayer-fuel/:campaignId/:dateISO',
    name: 'PrayerFuel',
    component: () => import('../pages/PrayerFuel.vue'),
  },
  {
    path: '/reminder-editor',
    name: 'ReminderEditor',
    component: () => import('../pages/ReminderEditor.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
