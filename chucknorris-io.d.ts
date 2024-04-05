declare module 'chucknorris-io' {
    export interface ChuckNorrisJoke {
      id: string;
      joke: string;
      categories: string[];
    }
  
    export default class ChuckNorris {
      constructor();
  
      getRandomJoke(): Promise<ChuckNorrisJoke>;
    }
  }
  