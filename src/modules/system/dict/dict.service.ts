import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dict } from '@/modules/system/dict/entities/dict.entity';
import { DictItem } from '@/modules/system/dict/entities/dict-item.entity';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict) private readonly repo: Repository<Dict>,
    @InjectRepository(DictItem) private readonly repo2: Repository<DictItem>,
  ) {}

  create(createDictDto: CreateDictDto) {
    return 'This action adds a new dict';
  }

  findAll() {
    return `This action returns all dict`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dict`;
  }

  update(id: number, updateDictDto: UpdateDictDto) {
    return `This action updates a #${id} dict`;
  }

  remove(id: number) {
    return `This action removes a #${id} dict`;
  }
}
