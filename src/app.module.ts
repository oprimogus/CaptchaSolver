import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcrModule } from './ocr/ocr.module';
import { PuppeterrModule } from './puppeterr/puppeterr.module';

@Module({
  imports: [OcrModule, PuppeterrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
