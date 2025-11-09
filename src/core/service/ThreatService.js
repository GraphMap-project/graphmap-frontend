import ApiService from './ApiService';
import AuthService from './AuthService';

class RouteService {
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
}

export default RouteService;
