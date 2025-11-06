// Helper function to check subscriptions without using composable
// Used in router guards where composables might not work properly

export function hasSubscriptions(): boolean {
  try {
    const stored = localStorage.getItem('prayer_app_subscriptions');
    if (!stored) return false;
    const subscriptions = JSON.parse(stored);
    return Array.isArray(subscriptions) && subscriptions.length > 0;
  } catch {
    return false;
  }
}

