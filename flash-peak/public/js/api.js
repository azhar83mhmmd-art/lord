/* LORD API client — thin fetch wrapper around the Express backend. */

const API = {
  base: '/api',

  async _get(path) {
    const res = await fetch(`${this.base}${path}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Gagal memuat data (${res.status})`);
    }
    return res.json();
  },

  async _post(path, data) {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.error || `Gagal mengirim data (${res.status})`);
    }
    return body;
  },

  async _delete(path) {
    const res = await fetch(`${this.base}${path}`, { method: 'DELETE' });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Gagal (${res.status})`);
    return body;
  },

  getStats() { return this._get('/stats'); },
  getActivities(limit = 50) { return this._get(`/activity?limit=${limit}`); },
  getMembers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this._get(`/members${qs ? '?' + qs : ''}`);
  },
  getMember(id) { return this._get(`/members/${id}`); },
  getMemberIdCard(id) { return this._get(`/members/${id}/idcard`); },
  getTopPlayers() { return this._get('/members/top'); },
  getSettings() { return this._get('/settings'); },
  register(payload) { return this._post('/register', payload); },
  adminOverview() { return this._get('/admin/overview'); },
  deleteMember(id) { return this._delete(`/admin/members/${id}`); }
};
