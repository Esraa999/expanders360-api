import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Match } from './entities/match.entity';
import { ProjectsService } from '../projects/projects.service';
import { VendorsService } from '../vendors/vendors.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private projectsService: ProjectsService,
    private vendorsService: VendorsService,
    private notificationsService: NotificationsService,
  ) {}

  async rebuildMatches(projectId: number): Promise<Match[]> {
    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Find matching vendors
    const matchingVendors = await this.vendorsService.findMatchingVendors(
      project.country,
      project.servicesNeeded,
    );

    // Delete existing matches for this project
    await this.matchRepository.delete({ projectId });

    // Create new matches
    const matches: Match[] = [];
    
    for (const vendor of matchingVendors) {
      const score = this.calculateMatchScore(project, vendor);
      
      const match = this.matchRepository.create({
        projectId: project.id,
        vendorId: vendor.id,
        score,
      });

      const savedMatch = await this.matchRepository.save(match);
      
      // Load relations for the response
      const matchWithRelations = await this.matchRepository.findOne({
        where: { id: savedMatch.id },
        relations: ['vendor', 'project'],
      });

      matches.push(matchWithRelations);

      // Send notification
      await this.notificationsService.sendMatchNotification(matchWithRelations);
    }

    return matches;
  }

  private calculateMatchScore(project: any, vendor: any): number {
    // Services overlap calculation
    const projectServices = new Set(project.servicesNeeded);
    const vendorServices = new Set(vendor.servicesOffered);
    const overlap = [...projectServices].filter(service => vendorServices.has(service));
    const servicesOverlap = overlap.length;

    // SLA weight calculation (lower SLA hours = better score)
    const slaWeight = Math.max(0, 10 - (vendor.responseSlaHours / 24) * 5);

    // Final score: services_overlap * 2 + rating + SLA_weight
    const score = (servicesOverlap * 2) + vendor.rating + slaWeight;

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  async findByProject(projectId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: { projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find({
      relations: ['project', 'vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRecentMatches(days: number = 30): Promise<Match[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.vendor', 'vendor')
      .leftJoinAndSelect('match.project', 'project')
      .where('match.createdAt >= :date', { date })
      .orderBy('match.createdAt', 'DESC')
      .getMany();
  }
}