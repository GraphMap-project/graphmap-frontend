import ApiService from './ApiService';

class RouteService {
  static async buildRoute(data) {
    return ApiService.request('shortest_path/', 'POST', data);
  }
}

export default RouteService;
