import { Module } from '@nestjs/common';

import { SchedulerService } from './scheduler.service';
import { MatchesModule } from '../matches/matches.module';
import { ProjectsModule } from '../projects/projects.module';
import { VendorsModule } from '../vendors/vendors.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [MatchesModule, ProjectsModule, VendorsModule, NotificationsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}