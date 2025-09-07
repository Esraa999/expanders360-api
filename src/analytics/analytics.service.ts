import { Injectable } from '@nestjs/common';
import { MatchesService } from '../matches/matches.service';
import { DocumentsService } from '../documents/documents.service';
import { ProjectsService } from '../projects/projects.service';

export interface TopVendorAnalytics {
  country: string;
  topVendors: {
    vendorId: number;
    vendorName: string;
    avgMatchScore: number;
    matchCount: number;
  }[];
  documentCount: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private matchesService: MatchesService,
    private documentsService: DocumentsService,
    private projectsService: ProjectsService,
  ) {}

  async getTopVendorsByCountry(): Promise<TopVendorAnalytics[]> {
    // Get matches from last 30 days
    const recentMatches = await this.matchesService.findRecentMatches(30);
    
    // Group matches by country
    const matchesByCountry: { [country: string]: any[] } = {};
    
    for (const match of recentMatches) {
      const country = match.project.country;
      if (!matchesByCountry[country]) {
        matchesByCountry[country] = [];
      }
      matchesByCountry[country].push(match);
    }

    const analytics: TopVendorAnalytics[] = [];

    for (const [country, matches] of Object.entries(matchesByCountry)) {
      // Calculate vendor statistics
      const vendorStats: { [vendorId: number]: { scores: number[], name: string } } = {};
      
      for (const match of matches) {
        const vendorId = match.vendor.id;
        if (!vendorStats[vendorId]) {
          vendorStats[vendorId] = {
            scores: [],
            name: match.vendor.name,
          };
        }
        vendorStats[vendorId].scores.push(match.score);
      }

      // Calculate average scores and get top 3
      const topVendors = Object.entries(vendorStats)
        .map(([vendorId, stats]) => ({
          vendorId: parseInt(vendorId),
          vendorName: stats.name,
          avgMatchScore: Math.round((stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length) * 100) / 100,
          matchCount: stats.scores.length,
        }))
        .sort((a, b) => b.avgMatchScore - a.avgMatchScore)
        .slice(0, 3);

      // Get project IDs for this country
      const projectIds = matches.map(match => match.project.id);
      const uniqueProjectIds = [...new Set(projectIds)];

      // Get document count for projects in this country
      const documentCounts = await this.documentsService.getDocumentCountByProject(uniqueProjectIds);
      const totalDocumentCount = Object.values(documentCounts).reduce((sum, count) => sum + count, 0);

      analytics.push({
        country,
        topVendors,
        documentCount: totalDocumentCount,
      });
    }

    return analytics.sort((a, b) => a.country.localeCompare(b.country));
  }

  async getGeneralAnalytics() {
    const [allMatches, allProjects] = await Promise.all([
      this.matchesService.findAll(),
      this.projectsService.findAll(),
    ]);

    const totalMatches = allMatches.length;
    const totalProjects = allProjects.length;
    const activeProjects = allProjects.filter(p => p.status === 'active').length;

    // Calculate average match score
    const avgMatchScore = allMatches.length > 0 
      ? Math.round((allMatches.reduce((sum, match) => sum + match.score, 0) / allMatches.length) * 100) / 100
      : 0;

    // Get recent activity (last 7 days)
    const recentMatches = await this.matchesService.findRecentMatches(7);
    const recentActivity = recentMatches.length;

    return {
      totalProjects,
      activeProjects,
      totalMatches,
      avgMatchScore,
      recentActivity,
    };
  }
}