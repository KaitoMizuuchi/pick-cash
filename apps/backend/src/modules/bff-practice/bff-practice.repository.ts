import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

@Injectable()
export class BffPracticeRepository {
  constructor(private readonly httpService: HttpService) {}

  async fetchPosts(): Promise<Post[]> {
    // 外部のAPIを取得する処理
    const { data } = await firstValueFrom(
      this.httpService.get<Post[]>(
        "https://jsonplaceholder.typicode.com/posts",
      ),
    );
    return data;
  }

  async fetchUsers(): Promise<User[]> {
    // 外部のAPIを取得する処理
    const { data } = await firstValueFrom(
      this.httpService.get<User[]>(
        "https://jsonplaceholder.typicode.com/users",
      ),
    );
    return data;
  }
}
