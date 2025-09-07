import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @ApiOperation({ summary: 'Get top vendors by country with document counts' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  getTopVendors() {
    return this.analyticsService.getTopVendorsByCountry();
  }

  @Get('general')
  @ApiOperation({ summary: 'Get general analytics' })
  @ApiResponse({ status: 200, description: 'General analytics retrieved successfully' })
  getGeneralAnalytics() {
    return this.analyticsService.getGeneralAnalytics();
  }
}