class ApiService {
  static baseURL = 'http://127.0.0.1:8000';

  static async request(
    endpoint,
    method = 'GET',
    data = null,
    headers = {},
    responseType = 'json',
  ) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, options);

      let responseData =
        responseType === 'blob' ? await response.blob() : await response.json();

      if (!response.ok) {
        let errorMessages = [`Request error ${response.status}`];

        if (responseData.errors) {
          errorMessages = Object.values(responseData.errors).flat();
        } else if (Array.isArray(responseData.detail)) {
          const detail = responseData.detail[0];

          // Обработка ошибок валидации пароля
          if (detail?.ctx?.error?.errors && typeof detail.ctx.error.errors === 'object') {
            // Получаем ошибки из нового формата ctx.error.errors
            errorMessages = Object.values(detail.ctx.error.errors);
          } else if (detail?.ctx?.errors && typeof detail.ctx.errors === 'object') {
            // Старый формат для обратной совместимости
            errorMessages = Object.values(detail.ctx.errors);
          } else if (typeof detail.msg === 'string') {
            errorMessages = [detail.msg];
          } else {
            errorMessages = [JSON.stringify(detail)];
          }
        } else if (typeof responseData.detail === 'string') {
          errorMessages = [responseData.detail];
        } else if (typeof responseData.message === 'string') {
          errorMessages = [responseData.message];
        }

        const error = new Error(errorMessages.join('\n'));
        error.messages = errorMessages;
        error.status = response.status;
        throw error;
      }
      return responseData;
    } catch (error) {
      console.error(`AuthService Error on ${endpoint}:`, error);
      throw error;
    }
  }
}

export default ApiService;
