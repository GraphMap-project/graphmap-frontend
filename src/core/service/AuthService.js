import ApiService from './ApiService';

class AuthService {
  static async login(data) {
    const response = await ApiService.request('account/login', 'POST', data);
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    return response;
  }

  static async register(data) {
    const response = await ApiService.request('account/register', 'POST', data);
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    return response;
  }

  static logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  static getAccessToken() {
    return localStorage.getItem('access_token');
  }

  static getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  static isAuthenticated() {
    return !!this.getAccessToken();
  }

  static async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await ApiService.request('account/refresh', 'POST', null, {
      Authorization: `Bearer ${refreshToken}`,
    });

    if (response.access_token && response.refresh_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      return response.access_token;
    } else {
      throw new Error('Failed to refresh access token');
    }
  }

  static async requestWithAuth(
    endpoint,
    method = 'GET',
    data = null,
    responseType = 'json',
  ) {
    let accessToken = localStorage.getItem('access_token');

    try {
      return await ApiService.request(
        endpoint,
        method,
        data,
        {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType,
      );
    } catch (error) {
      if (
        error.status === 401 ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        try {
          accessToken = await this.refreshToken();

          return await ApiService.request(
            endpoint,
            method,
            data,
            {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType,
          );
        } catch (refreshError) {
          this.logout();
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        throw error;
      }
    }
  }

  static async forgotPassword(data) {
    // data = { email }
    return ApiService.request('account/forgot-password', 'POST', data);
  }

  static async resetPassword(data) {
    // data = { token, new_password }
    return ApiService.request('account/reset-password', 'POST', data);
  }
}

export default AuthService;
