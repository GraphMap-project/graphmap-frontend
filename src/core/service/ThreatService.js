import ApiService from './ApiService';
import AuthService from './AuthService';

class ThreatService {
  static baseEndpoint = 'api/threats';

  static async getAll() {
    return ApiService.request(this.baseEndpoint, 'GET');
  }

  static async create(threat) {
    return AuthService.requestWithAuth(this.baseEndpoint, 'POST', threat);
  }

  static async delete(threatId) {
    return AuthService.requestWithAuth(`${this.baseEndpoint}/${threatId}`, 'DELETE');
  }

  static async getRequests() {
    return AuthService.requestWithAuth(`${this.baseEndpoint}/requests`, 'GET');
  }

  static async approveRequest(requestId) {
    return AuthService.requestWithAuth(
      `${this.baseEndpoint}/requests/${requestId}/approve`,
      'POST',
    );
  }

  static async declineRequest(requestId) {
    return AuthService.requestWithAuth(
      `${this.baseEndpoint}/requests/${requestId}/decline`,
      'POST',
    );
  }
}

export default ThreatService;
