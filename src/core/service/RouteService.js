import ApiService from './ApiService';

class RouteService {
  static async buildRoute(data) {
    return ApiService.request('shortest_path/', 'POST', data);
  }

  static async generateRouteFile(routeId) {
    return ApiService.request(`generate_route_file/${routeId}/`, 'GET', null, {}, 'blob');
  }
}

export default RouteService;
