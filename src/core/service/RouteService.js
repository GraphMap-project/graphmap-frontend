import ApiService from './ApiService';
import AuthService from './AuthService';

class RouteService {
  static async buildRoute(data) {
    return ApiService.request('shortest_path', 'POST', data);
  }

  static async generateRouteFile(routeId) {
    return ApiService.request(`generate_route_file/${routeId}`, 'GET', null, {}, 'blob');
  }
  static async saveRoute(routeId, name) {
    return AuthService.requestWithAuth('save_route', 'POST', {
      route_id: routeId,
      name: name,
    });
  }
}

export default RouteService;
