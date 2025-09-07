import { IsString, IsArray, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'European Market Expansion' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Expanding our SaaS platform to European markets' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Germany' })
  @IsString()
  country: string;

  @ApiProperty({ example: ['legal-compliance', 'market-research', 'local-partnerships'] })
  @IsArray()
  @IsString({ each: true })
  servicesNeeded: string[];

  @ApiProperty({ example: 50000.00 })
  @IsNumber()
  budget: number;

  @ApiProperty({ enum: ProjectStatus, required: false, default: ProjectStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-06-01', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  clientId: number;
}