import { HttpClient } from 'aurelia-fetch-client';

/**
 * Fetches JSON files that reside in the data/ folder
 */
export class JsonFetcherService {
  fetch(file: string) {
    return this.createNewHttpClient().fetch(file)
      .then(response => response.json());
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
