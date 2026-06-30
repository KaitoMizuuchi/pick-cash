import { describe, expect, it, vi } from 'vitest';
import type { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

// Repository をモックして Service 単体の振る舞い（引数の透過・戻り値の透過）だけを検証する。
const createRepositoryMock = () =>
  ({
    findAll: vi.fn(),
  }) as unknown as CategoriesRepository;

describe('CategoriesService', () => {
  it('引数の type を Repository.findAll にそのまま渡す', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findAll).mockResolvedValue([]);
    const service = new CategoriesService(repository);

    await service.findAll('income');

    expect(repository.findAll).toHaveBeenCalledWith('income');
  });

  it('type未指定なら undefined のまま Repository.findAll に渡す', async () => {
    const repository = createRepositoryMock();
    vi.mocked(repository.findAll).mockResolvedValue([]);
    const service = new CategoriesService(repository);

    await service.findAll();

    expect(repository.findAll).toHaveBeenCalledWith(undefined);
  });

  it('Repository の戻り値をそのまま返す', async () => {
    const repository = createRepositoryMock();
    const fixture = [{ id: 'c1', name: '食費', type: 'expense' }];
    vi.mocked(repository.findAll).mockResolvedValue(
      fixture as unknown as Awaited<ReturnType<typeof repository.findAll>>,
    );
    const service = new CategoriesService(repository);

    const result = await service.findAll();

    expect(result).toBe(fixture);
  });
});
