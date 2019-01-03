import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from 'aurelia-framework';

/**
 * Fetches JSON files that reside in the data/ folder
 */
@autoinject
export class JsonFetcherService {
  constructor(private http: HttpClient) {
    http.configure(config => {
      config
          .useStandardConfiguration()
          .withBaseUrl('data/');
    });
  }

  fetch(file: string) {
    return this.createNewHttpClient().fetch(file)
      .then(response => response.json());
  }

  async fetchSync(file: string) {
    let response = await this.http.fetch(file);
    let data = await response.json();
    return data;
  }

  private createNewHttpClient(): HttpClient {
    const client = new HttpClient();

    client.configure(config => {
      config
        .withBaseUrl('data/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });

    return client;
  }
}
