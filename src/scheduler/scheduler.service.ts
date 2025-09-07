import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MatchesService } from '../matches/matches.service';
import { ProjectsService } from '../projects/projects.service';
import { VendorsService } from '../vendors/vendors.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private matchesService: MatchesService,
    private projectsService: ProjectsService,
    private vendorsService: VendorsService,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async refreshDailyMatches() {
    this.logger.log('Starting daily match refresh...');
    
    try {
      const activeProjects = await this.projectsService.findActiveProjects();
      
      for (const project of activeProjects) {
        this.logger.log(`Refreshing matches for project ${project.id}: ${project.name}`);
        await this.matchesService.rebuildMatches(project.id);
      }
      
      this.logger.log(`Daily match refresh completed for ${activeProjects.length} projects`);
    } catch (error) {
      this.logger.error(`Daily match refresh failed: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async checkVendorSlaCompliance() {
    this.logger.log('Checking vendor SLA compliance...');
    
    try {
      const vendors = await this.vendorsService.findAll();
      const recentMatches = await this.matchesService.findRecentMatches(7);
      
      // Group matches by vendor
      const matchesByVendor: { [vendorId: number]: any[] } = {};
      
      for (const match of recentMatches) {
        const vendorId = match.vendor.id;
        if (!matchesByVendor[vendorId]) {
          matchesByVendor[vendorId] = [];
        }
        matchesByVendor[vendorId].push(match);
      }

      // Check each vendor's SLA
      for (const vendor of vendors) {
        const vendorMatches = matchesByVendor[vendor.id] || [];
        
        if (vendorMatches.length > 0) {
          // Check if any matches are older than SLA hours
          const slaThreshold = new Date();
          slaThreshold.setHours(slaThreshold.getHours() - vendor.responseSlaHours);
          
          const expiredMatches = vendorMatches.filter(match => 
            new Date(match.createdAt) < slaThreshold
          );
          
          if (expiredMatches.length > 0) {
            const projects = expiredMatches.map(match => match.project);
            await this.notificationsService.sendSlaWarning(vendor, projects);
            this.logger.warn(`SLA warning sent for vendor ${vendor.name} (${expiredMatches.length} expired matches)`);
          }
        }
      }
      
      this.logger.log('SLA compliance check completed');
    } catch (error) {
      this.logger.error(`SLA compliance check failed: ${error.message}`);
    }
  }
}