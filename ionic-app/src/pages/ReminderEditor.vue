<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/prayer-feed" />
        </ion-buttons>
        <ion-title>Reminders</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showAddModal = true">
            <ion-icon :icon="addOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <div v-if="reminders.length === 0" class="empty-state">
          <ion-icon :icon="notificationsOutline" size="large" />
          <p>No reminders set</p>
          <p class="subtitle">Create a reminder to be notified at your chosen times</p>
          <ion-button @click="showAddModal = true">
            Create Reminder
          </ion-button>
        </div>

        <ion-list v-else>
          <ion-item
            v-for="reminder in reminders"
            :key="reminder.id"
            lines="full"
          >
            <ion-label>
              <h2>{{ reminder.label }}</h2>
              <p>{{ formatReminderSchedule(reminder) }}</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button fill="clear" @click="editReminder(reminder)">
                <ion-icon :icon="createOutline" />
              </ion-button>
              <ion-button fill="clear" color="danger" @click="deleteReminder(reminder.id)">
                <ion-icon :icon="trashOutline" />
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>
      </div>

      <!-- Add/Edit Modal -->
      <ion-modal :is-open="showAddModal || showEditModal" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingReminder ? 'Edit Reminder' : 'New Reminder' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="modal-content">
            <ion-item>
              <ion-label position="stacked">Label</ion-label>
              <ion-input v-model="reminderForm.label" placeholder="e.g., Morning Prayer" />
            </ion-item>

            <ion-item>
              <ion-label>Days of Week</ion-label>
            </ion-item>
            <div class="days-selector">
              <ion-chip
                v-for="(day, index) in daysOfWeek"
                :key="index"
                :outline="!reminderForm.daysOfWeek.includes(index)"
                :color="reminderForm.daysOfWeek.includes(index) ? 'primary' : 'medium'"
                @click="toggleDay(index)"
              >
                {{ day }}
              </ion-chip>
            </div>

            <ion-item>
              <ion-label position="stacked">Times (HH:mm format, one per line)</ion-label>
              <ion-textarea
                v-model="timesText"
                placeholder="08:00&#10;12:00&#10;18:00"
                :rows="4"
              />
            </ion-item>

            <div class="modal-actions">
              <ion-button :expand="'block'" @click="saveReminder">
                {{ editingReminder ? 'Update' : 'Create' }} Reminder
              </ion-button>
            </div>
          </div>
        </ion-content>
      </ion-modal>
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
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonChip,
  IonModal,
} from '@ionic/vue';
import {
  addOutline,
  notificationsOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { useReminders, type Reminder } from '../composables/useReminders';
import { getDaysOfWeekNames } from '../utils/date';

const router = useRouter();
const { reminders, addReminder, updateReminder, removeReminder } = useReminders();

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingReminder = ref<Reminder | null>(null);

const daysOfWeek = getDaysOfWeekNames();

const reminderForm = ref({
  label: '',
  daysOfWeek: [] as number[],
  times: [] as string[],
});

const timesText = computed({
  get: () => reminderForm.value.times.join('\n'),
  set: (value: string) => {
    reminderForm.value.times = value
      .split('\n')
      .map(t => t.trim())
      .filter(t => t && /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(t));
  },
});

const toggleDay = (dayIndex: number) => {
  const index = reminderForm.value.daysOfWeek.indexOf(dayIndex);
  if (index > -1) {
    reminderForm.value.daysOfWeek.splice(index, 1);
  } else {
    reminderForm.value.daysOfWeek.push(dayIndex);
  }
};

const editReminder = (reminder: Reminder) => {
  editingReminder.value = reminder;
  reminderForm.value = {
    label: reminder.label,
    daysOfWeek: [...reminder.daysOfWeek],
    times: [...reminder.times],
  };
  showEditModal.value = true;
};

const deleteReminder = (id: string) => {
  removeReminder(id);
};

const saveReminder = () => {
  if (!reminderForm.value.label.trim()) {
    alert('Please enter a label');
    return;
  }
  if (reminderForm.value.daysOfWeek.length === 0) {
    alert('Please select at least one day');
    return;
  }
  if (reminderForm.value.times.length === 0) {
    alert('Please enter at least one time');
    return;
  }

  if (editingReminder.value) {
    updateReminder(editingReminder.value.id, reminderForm.value);
  } else {
    addReminder(reminderForm.value);
  }

  closeModal();
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingReminder.value = null;
  reminderForm.value = {
    label: '',
    daysOfWeek: [],
    times: [],
  };
};

const formatReminderSchedule = (reminder: Reminder): string => {
  const days = reminder.daysOfWeek.map(d => daysOfWeek[d].substring(0, 3)).join(', ');
  const times = reminder.times.join(', ');
  return `${days} at ${times}`;
};
</script>

<style scoped>
.container {
  padding: 16px;
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

.modal-content {
  padding: 16px;
}

.days-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
}

.modal-actions {
  margin-top: 24px;
  padding: 16px;
}
</style>

