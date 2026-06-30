import { Injectable } from "@nestjs/common";
import { BffPracticeRepository } from "./bff-practice.repository";

@Injectable()
export class BffPracticeService {
  constructor(private readonly repository: BffPracticeRepository) {}

  async findAll() {
    const [posts, users] = await Promise.all([
      this.repository.fetchPosts(),
      this.repository.fetchUsers(),
    ]);

    const combinedData = posts.map((post) => {
      const user = users.find((user) => user.id === post.userId);
      return {
        ...post,
        userName: user ? user.name : null,
      };
    });

    // 最初の10件だけ返す
    return combinedData.slice(0, 10);
  }
}
