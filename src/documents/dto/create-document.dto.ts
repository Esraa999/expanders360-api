import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Market Research Report - Germany' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Comprehensive market analysis for German expansion...' })
  @IsString()
  content: string;

  @ApiProperty({ example: ['market-research', 'germany', 'expansion'] })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  tags: string[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  projectId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: any;

  @IsOptional()
  @IsNumber()
  uploadedBy?: number;
}