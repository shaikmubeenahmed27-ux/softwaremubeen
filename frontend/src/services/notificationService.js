import { supabase } from '../lib/supabase';

let MOCK_NOTIFICATIONS = [];

export async function getNotifications({ userRole = 'admin', authEmployeeId = '' } = {}) {
  try {
    const { data: dbNotifs, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbNotifs && dbNotifs.length > 0) {
      return dbNotifs.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        category: n.category || 'announcement',
        read: n.is_read || false,
        timestamp: new Date(n.created_at || Date.now()).toLocaleString()
      }));
    }

    return MOCK_NOTIFICATIONS;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return MOCK_NOTIFICATIONS;
  }
}

export async function markAsRead(notificationId) {
  MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map((n) => {
    if (n.id === notificationId) {
      return { ...n, read: true };
    }
    return n;
  });
  return { success: true };
}

export async function markAllAsRead() {
  MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map((n) => ({ ...n, read: true }));
  return { success: true };
}

export async function createNotification(newNotif) {
  const notif = {
    id: `notif_${Date.now()}`,
    title: newNotif.title,
    message: newNotif.message,
    category: newNotif.category || 'announcement',
    read: false,
    timestamp: new Date().toLocaleString()
  };

  MOCK_NOTIFICATIONS = [notif, ...MOCK_NOTIFICATIONS];
  return { success: true, data: notif };
}
