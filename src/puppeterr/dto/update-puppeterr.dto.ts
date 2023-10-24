import { PartialType } from '@nestjs/mapped-types';
import { CreatePuppeterrDto } from './create-puppeterr.dto';

export class UpdatePuppeterrDto extends PartialType(CreatePuppeterrDto) {}
