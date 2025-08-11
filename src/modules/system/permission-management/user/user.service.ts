import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/modules/system/permission-management/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageQueryDto } from '@/common/pagination/pagination.dto';
import { paginate } from '@/common/pagination/paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async page(q: PageQueryDto) {
    // 你可以先创建 qb 并加筛选条件
    const qb = this.repo.createQueryBuilder('u');

    // 如果有 keyword 等扩展查询字段，可以按需追加
    // if ((q as any).keyword) {
    //   const kw = `%${(q as any).keyword}%`;
    //   qb.andWhere('(u.username LIKE :kw OR u.nickname LIKE :kw)', { kw });
    // }

    return paginate<User>({
      query: q,
      qb,
      alias: 'u',
    });
  }
}
