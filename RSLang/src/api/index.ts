import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import authStorage from '../controller/authorization/auth-storage';
import { TAnswerType } from '../controller/daystatistics/interfaces';
import { Difficulty, IAggregatedWord, IOptional } from '../controller/games/interfaces';
import {
  WordsDataT, WordDataT, AggregatedWordsResponseT, UserWordsT,
} from '../types/types';
import {
  IApi, IAuthInfo, IRefreshTokenResponse,
  ISingInResponse, IUserAggregatedWord,
  IUserInfo, IUserSingIn, LearntWordsPesp,
} from './interfaces';

export class Api implements IApi {
  apiClient: AxiosInstance;

  private baseURL: string;

  constructor(baseUrl: string) {
    this.baseURL = baseUrl;
    this.setBaseUrlInAxios();
    this.apiClient = axios.create({
      baseURL: this.baseURL,
    });
    this.apiClient.interceptors.request.use((config) => {
      const token = authStorage.get()?.token;
      if (config?.headers && token && !config.headers.Authorization) {
        const { headers } = config;
        headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  setBaseUrlInAxios() {
    if (!axios.defaults.baseURL) {
      axios.defaults.baseURL = this.baseURL;
    }
  }

  public async createUser(userRegistration: IUserInfo) {
    const resp = await this.apiClient.post('/users', userRegistration);
    return resp;
  }

  public async signIn(userInfo: IUserSingIn): Promise<AxiosResponse<ISingInResponse>> {
    const resp = await this.apiClient.post('/signin', userInfo);
    return resp;
  }

  public async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AxiosResponse<IRefreshTokenResponse>> {
    const resp = await this.apiClient.get(
      `/users/${userId}/tokens`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    return resp;
  }

  public async getChunkOfWords(group: number, page: number): Promise<AxiosResponse<WordsDataT>> {
    const res = await this.apiClient.get('/words', {
      params: { group, page },
    });
    return res;
  }

  public async getWordWithAssetsById(wordId: string): Promise<AxiosResponse<WordDataT>> {
    const res = await this.apiClient.get(`/words/${wordId}`);
    return res;
  }

  public async getUserWords(): Promise<AxiosResponse<UserWordsT>> {
    const res = await this.apiClient.get(`/users/${(<IAuthInfo>authStorage.get()).userId}/words`);
    return res;
  }

  public async updateOrCreateUserWord(
    wordId: string,
    difficulty?: Difficulty,
    optional?: IOptional,
  ) {
    const defaultDifficulty = Difficulty.process;
    const date = new Date().toString();
    const defaultOptional = {
      serieRight: 0,
      serieWrong: 0,
      addTime: date,
      games: {
        sprint: {
          right: 0,
          wrong: 0,
        },
        audiocall: {
          right: 0,
          wrong: 0,
        },
      },
    };

    const userWordsData = (await this.getUserWords()).data;
    const wordsIds = (userWordsData.map((userData) => userData.wordId));

    if (wordsIds.includes(wordId)) {
      const userWordData = (await this.getUserWord(wordId)).data;
      const newDifficulty = difficulty || userWordData.difficulty || defaultDifficulty;
      const newOptional = optional || userWordData.optional || defaultOptional;
      await this.updateUserWord(wordId, newDifficulty, newOptional);
    } else {
      const newDifficulty = difficulty || defaultDifficulty;
      const newOptional = optional || defaultOptional;
      await this.apiClient.post(`users/${(<IAuthInfo>authStorage.get()).userId}/words/${wordId}`, { difficulty: Difficulty[newDifficulty], optional: newOptional });
    }
  }

  public async getUserWord(wordId: string) {
    const res = await this.apiClient.get(`/users/${(<IAuthInfo>authStorage.get()).userId}/words/${wordId}`);
    return res;
  }

  public async setAggregatedWord(
    wordId: string,
    game: 'sprint' | 'audiocall',
    answer: TAnswerType,
  ) {
    let optional = {
      serieRight: 0,
      serieWrong: 0,
      addTime: Date(),
      games: {
        sprint: {
          right: 0,
          wrong: 0,
        },
        audiocall: {
          right: 0,
          wrong: 0,
        },
      },
    };
    try {
      const resp = await this.getUserWord(wordId);
      const word = resp.data as IUserAggregatedWord;
      let wordDifficulty = word.difficulty;
      optional = word.optional;
      optional.games[game][answer] += 1;
      if (answer === 'right') {
        optional.serieWrong = 0;
        if (optional.serieRight === 2) {
          wordDifficulty = Difficulty.learned;
        }
        optional.serieRight += 1;
      }
      if (answer === 'wrong') {
        optional.serieRight = 0;
        if (optional.serieWrong === 2) {
          wordDifficulty = Difficulty.hard;
        }
        optional.serieWrong += 1;
        if (wordDifficulty === Difficulty.learned) {
          wordDifficulty = Difficulty.process;
        }
      }
      this.updateOrCreateUserWord(wordId, wordDifficulty, optional);
    } catch (error) {
      const er = error as AxiosError;
      if (er.response?.status === 404) {
        optional.games[game][answer] = 1;
        if (answer === 'right') {
          optional.serieRight = 1;
        } else {
          optional.serieWrong = 1;
        }
        this.updateOrCreateUserWord(wordId, Difficulty.process, optional);
      }
    }
  }

  public async getAllUserAggregatedHardWords(
    page: number,
  ): Promise<AxiosResponse<AggregatedWordsResponseT>> {
    const res = await this.apiClient.get(`/users/${(<IAuthInfo>authStorage.get()).userId}/aggregatedWords`, {
      params: {
        page,
        wordsPerPage: 20,
        filter: '{"$or":[{"userWord.difficulty":"hard"}]}',
      },
    });
    return res;
  }

  public async updateUserWord(
    wordId: string,
    difficulty: Difficulty,
    optional: IOptional,
  ): Promise<void> {
    await this.apiClient.put(`/users/${(<IAuthInfo>authStorage.get()).userId}/words/${wordId}`, { difficulty, optional });
  }

  public async getLearntUserWords(userId: string): Promise<AxiosResponse<LearntWordsPesp>> {
    return this.apiClient.get(`/users/${userId}/aggregatedWords`, {
      params: {
        wordsPerPage: 4000,
        filter: '{"userWord.difficulty":"learned"}',
      },
    });
  }

  getAudio(filePath: string) {
    return this.apiClient.get(filePath);
  }

  public async getWordStatistic(wordId: string): Promise<IAggregatedWord | null> {
    const wordsIds = ((await this.getUserWords()).data.map((userData) => userData.wordId));
    if (wordsIds.includes(wordId)) {
      const res = <IAggregatedWord>(await this.getUserWord(wordId)).data;
      return res;
    }
    return null;
  }
}
export const herokuApi = new Api('https://rslang-l9uj.onrender.com');
