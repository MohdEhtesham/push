import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  async fetchPosts() {
    try {
      const response = await this.api.get('/posts');
      return {
        data: response.data.slice(0, 5),
        loading: false,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        loading: false,
        error: error.message,
      };
    }
  }

  async fetchUsers() {
    try {
      const response = await this.api.get('/users');
      return {
        data: response.data.slice(0, 3),
        loading: false,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        loading: false,
        error: error.message,
      };
    }
  }
}

export default new ApiService();