import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28568340-15f9de8a92b9201436ce2885d';

  constructor() {
    this.query = null;
    this.page = 1;
    this.totalPages = 0;
    this.totalHits = 0;
  }

  async fetchPhotos() {
    const params = new URLSearchParams({
      key: this.#API_KEY,
      q: `${this.query}`,
      page: `${this.page}`,
      per_page: 40,
      imageType: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    });
    try {
      const response = await axios.get(`${this.#BASE_URL}?${params}`);
      this.totalPages = Math.ceil(response.data.totalHits / 40);
      this.totalHits = response.data.totalHits;
      return response.data.hits;
    } catch (error) {
      console.log(error);
    }
  }

  increasePage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  setQuery(query) {
    this.query = query;
  }

  getTotalHits() {
    return this.totalHits;
  }
}
