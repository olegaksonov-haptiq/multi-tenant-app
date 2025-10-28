import Cookies from 'js-cookie';

export const sessionStorage = {
  getUser(): { token: string; tenantId: string } | null {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    const user = this.getUser();

    return user?.token ?? null;
  },

  setToken(token: string, tenantId: string) {
    Cookies.set('user', JSON.stringify({ token, tenantId }));
  },

  clearToken() {
    Cookies.remove('user');
  },
};
