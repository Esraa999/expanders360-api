import { IsString, IsArray, IsNumber, IsEmail, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'Global Expansion Partners' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Leading provider of international expansion services', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['Germany', 'France', 'Spain'] })
  @IsArray()
  @IsString({ each: true })
  countriesSupported: string[];

  @ApiProperty({ example: ['legal-compliance', 'market-research', 'local-partnerships'] })
  @IsArray()
  @IsString({ each: true })
  servicesOffered: string[];

  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 24 })
  @IsNumber()
  responseSlaHours: number;

  @ApiProperty({ example: 'contact@globalexpansion.com', required: false })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ example: '+1-555-0123', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://globalexpansion.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}