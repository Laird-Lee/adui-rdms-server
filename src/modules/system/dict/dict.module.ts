import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { Dict } from '@/modules/system/dict/entities/dict.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictItem } from '@/modules/system/dict/entities/dict-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dict, DictItem])],
  controllers: [DictController],
  providers: [DictService],
})
export class DictModule {}
