import { Module } from '@nestjs/common';
import { PuppeterrService } from './puppeterr.service';

@Module({
  providers: [PuppeterrService],
})
export class PuppeterrModule {}
