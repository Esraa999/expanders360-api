import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Matches')
@Controller('matches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('projects/:id/rebuild')
  @ApiOperation({ summary: 'Rebuild matches for a project' })
  @ApiResponse({ status: 201, description: 'Matches rebuilt successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  rebuildMatches(@Param('id') projectId: string) {
    return this.matchesService.rebuildMatches(+projectId);
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Get matches for a project' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  findByProject(@Param('id') projectId: string) {
    return this.matchesService.findByProject(+projectId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, description: 'Matches retrieved successfully' })
  findAll() {
    return this.matchesService.findAll();
  }
}