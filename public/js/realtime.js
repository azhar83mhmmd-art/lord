/* Reusable Realtime wiring for the members / activities / stats tables.
   Any page that shows community data (dashboard, admin panel,
   leaderboard, members list) calls subscribeDashboardRealtime with the
   callbacks it wants re-run whenever the underlying table changes —
   so every visitor sees new registrations, activity, and stat changes
   live, without a manual refresh.

   Debounced per-table: Supabase can fire several INSERT/UPDATE events
   in a tight burst (e.g. registration touches members + activities +
   stats all at once), so each callback is debounced slightly to avoid
   redundant back-to-back re-fetches. */

let _dashboardRealtimeChannel = null;

function _debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function subscribeDashboardRealtime({ onMembers, onActivities, onStats } = {}) {
  if (typeof sb === 'undefined') {
    console.warn('Supabase client (sb) belum siap — realtime dashboard nonaktif.');
    return null;
  }

  if (_dashboardRealtimeChannel) {
    sb.removeChannel(_dashboardRealtimeChannel);
  }

  const debouncedMembers = onMembers ? _debounce(onMembers, 300) : null;
  const debouncedActivities = onActivities ? _debounce(onActivities, 300) : null;
  const debouncedStats = onStats ? _debounce(onStats, 300) : null;

  let channel = sb.channel('lord-dashboard-realtime');

  if (debouncedMembers) {
    channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, debouncedMembers);
  }
  if (debouncedActivities) {
    channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, debouncedActivities);
  }
  if (debouncedStats) {
    channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'stats' }, debouncedStats);
  }

  channel.subscribe();
  _dashboardRealtimeChannel = channel;

  window.addEventListener('beforeunload', () => {
    if (_dashboardRealtimeChannel) sb.removeChannel(_dashboardRealtimeChannel);
  });

  return channel;
}
