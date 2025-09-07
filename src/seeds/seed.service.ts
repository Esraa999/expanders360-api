import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserRole } from '../auth/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Match } from '../matches/entities/match.entity';
import { Document } from '../documents/schemas/document.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async run() {
    // Clear existing data
    await this.clearData();

    // Seed users
    const users = await this.seedUsers();
    console.log(`✅ Created ${users.length} users`);

    // Seed clients
    const clients = await this.seedClients(users);
    console.log(`✅ Created ${clients.length} clients`);

    // Seed vendors
    const vendors = await this.seedVendors();
    console.log(`✅ Created ${vendors.length} vendors`);

    // Seed projects
    const projects = await this.seedProjects(clients);
    console.log(`✅ Created ${projects.length} projects`);

    // Seed matches
    const matches = await this.seedMatches(projects, vendors);
    console.log(`✅ Created ${matches.length} matches`);

    // Seed documents
    const documents = await this.seedDocuments(projects);
    console.log(`✅ Created ${documents.length} documents`);
  }

  private async clearData() {
    await this.documentModel.deleteMany({});
    await this.matchRepository.delete({});
    await this.projectRepository.delete({});
    await this.vendorRepository.delete({});
    await this.clientRepository.delete({});
    await this.userRepository.delete({});
    console.log('🧹 Cleared existing data');
  }

  private async seedUsers(): Promise<User[]> {
    const usersData = [
      {
        email: 'admin@expanders360.com',
        password: await bcrypt.hash('admin123', 12),
        role: UserRole.ADMIN,
      },
      {
        email: 'client1@acme.com',
        password: await bcrypt.hash('client123', 12),
        role: UserRole.CLIENT,
      },
      {
        email: 'client2@techcorp.com',
        password: await bcrypt.hash('client123', 12),
        role: UserRole.CLIENT,
      },
      {
        email: 'client3@startup.io',
        password: await bcrypt.hash('client123', 12),
        role: UserRole.CLIENT,
      },
    ];

    const users = this.userRepository.create(usersData);
    return this.userRepository.save(users);
  }

  private async seedClients(users: User[]): Promise<Client[]> {
    const clientUsers = users.filter(user => user.role === UserRole.CLIENT);
    
    const clientsData = [
      {
        companyName: 'Acme Corporation',
        contactEmail: 'contact@acme.com',
        phone: '+1-555-0123',
        address: '123 Business St, New York, NY 10001',
        website: 'https://acme.com',
        userId: clientUsers[0].id,
      },
      {
        companyName: 'TechCorp Solutions',
        contactEmail: 'hello@techcorp.com',
        phone: '+1-555-0456',
        address: '456 Tech Ave, San Francisco, CA 94105',
        website: 'https://techcorp.com',
        userId: clientUsers[1].id,
      },
      {
        companyName: 'Startup Innovations',
        contactEmail: 'team@startup.io',
        phone: '+1-555-0789',
        address: '789 Innovation Blvd, Austin, TX 78701',
        website: 'https://startup.io',
        userId: clientUsers[2].id,
      },
    ];

    const clients = this.clientRepository.create(clientsData);
    return this.clientRepository.save(clients);
  }

  private async seedVendors(): Promise<Vendor[]> {
    const vendorsData = [
      {
        name: 'European Expansion Partners',
        description: 'Leading provider of European market entry services',
        countriesSupported: ['Germany', 'France', 'Spain', 'Italy'],
        servicesOffered: ['legal-compliance', 'market-research', 'local-partnerships'],
        rating: 4.8,
        responseSlaHours: 12,
        contactEmail: 'contact@europeanexpansion.com',
        phone: '+49-30-12345678',
        website: 'https://europeanexpansion.com',
      },
      {
        name: 'Global Legal Solutions',
        description: 'International legal compliance specialists',
        countriesSupported: ['Germany', 'UK', 'Netherlands', 'Sweden'],
        servicesOffered: ['legal-compliance', 'regulatory-consulting'],
        rating: 4.6,
        responseSlaHours: 24,
        contactEmail: 'legal@globallegal.com',
        phone: '+44-20-87654321',
        website: 'https://globallegal.com',
      },
      {
        name: 'Asia Pacific Consultants',
        description: 'Specialists in Asian market expansion',
        countriesSupported: ['Japan', 'Singapore', 'Australia', 'South Korea'],
        servicesOffered: ['market-research', 'local-partnerships', 'cultural-consulting'],
        rating: 4.7,
        responseSlaHours: 18,
        contactEmail: 'info@apacconsultants.com',
        phone: '+65-6123-4567',
        website: 'https://apacconsultants.com',
      },
      {
        name: 'LatAm Business Bridge',
        description: 'Latin American market entry experts',
        countriesSupported: ['Brazil', 'Mexico', 'Argentina', 'Chile'],
        servicesOffered: ['market-research', 'local-partnerships', 'translation-services'],
        rating: 4.4,
        responseSlaHours: 36,
        contactEmail: 'contact@latambridge.com',
        phone: '+55-11-9876-5432',
        website: 'https://latambridge.com',
      },
      {
        name: 'Nordic Solutions Group',
        description: 'Scandinavian expansion specialists',
        countriesSupported: ['Sweden', 'Norway', 'Denmark', 'Finland'],
        servicesOffered: ['legal-compliance', 'market-research', 'tech-integration'],
        rating: 4.9,
        responseSlaHours: 8,
        contactEmail: 'hello@nordicsolutions.com',
        phone: '+46-8-123-4567',
        website: 'https://nordicsolutions.com',
      },
    ];

    const vendors = this.vendorRepository.create(vendorsData);
    return this.vendorRepository.save(vendors);
  }

  private async seedProjects(clients: Client[]): Promise<Project[]> {
    const projectsData = [
      {
        name: 'European SaaS Expansion',
        description: 'Expanding our SaaS platform to European markets, focusing on GDPR compliance and local partnerships',
        country: 'Germany',
        servicesNeeded: ['legal-compliance', 'market-research', 'local-partnerships'],
        budget: 75000,
        status: ProjectStatus.ACTIVE,
        clientId: clients[0].id,
      },
      {
        name: 'UK Fintech Launch',
        description: 'Launching our fintech product in the UK market with regulatory compliance',
        country: 'UK',
        servicesNeeded: ['legal-compliance', 'regulatory-consulting'],
        budget: 120000,
        status: ProjectStatus.ACTIVE,
        clientId: clients[1].id,
      },
      {
        name: 'Japanese Market Entry',
        description: 'Entering the Japanese market with cultural adaptation and local partnerships',
        country: 'Japan',
        servicesNeeded: ['market-research', 'cultural-consulting', 'local-partnerships'],
        budget: 95000,
        status: ProjectStatus.ACTIVE,
        clientId: clients[2].id,
      },
      {
        name: 'Brazilian E-commerce Expansion',
        description: 'Expanding e-commerce operations to Brazil',
        country: 'Brazil',
        servicesNeeded: ['market-research', 'local-partnerships'],
        budget: 60000,
        status: ProjectStatus.PENDING,
        clientId: clients[0].id,
      },
      {
        name: 'Nordic Tech Integration',
        description: 'Integrating our tech solutions in Nordic countries',
        country: 'Sweden',
        servicesNeeded: ['tech-integration', 'legal-compliance'],
        budget: 85000,
        status: ProjectStatus.ACTIVE,
        clientId: clients[1].id,
      },
    ];

    const projects = this.projectRepository.create(projectsData);
    return this.projectRepository.save(projects);
  }

  private async seedMatches(projects: Project[], vendors: Vendor[]): Promise<Match[]> {
    const matches: Match[] = [];

    // Create some sample matches with calculated scores
    const matchData = [
      { projectId: projects[0].id, vendorId: vendors[0].id }, // Germany project with European vendor
      { projectId: projects[1].id, vendorId: vendors[1].id }, // UK project with Global Legal
      { projectId: projects[2].id, vendorId: vendors[2].id }, // Japan project with Asia Pacific
      { projectId: projects[3].id, vendorId: vendors[3].id }, // Brazil project with LatAm
      { projectId: projects[4].id, vendorId: vendors[4].id }, // Sweden project with Nordic
      { projectId: projects[0].id, vendorId: vendors[1].id }, // Germany project with Global Legal (secondary match)
    ];

    for (const matchInfo of matchData) {
      const project = projects.find(p => p.id === matchInfo.projectId);
      const vendor = vendors.find(v => v.id === matchInfo.vendorId);
      
      if (project && vendor) {
        const score = this.calculateMatchScore(project, vendor);
        
        const match = this.matchRepository.create({
          projectId: matchInfo.projectId,
          vendorId: matchInfo.vendorId,
          score,
        });
        
        matches.push(match);
      }
    }

    return this.matchRepository.save(matches);
  }

  private calculateMatchScore(project: any, vendor: any): number {
    const projectServices = new Set(project.servicesNeeded);
    const vendorServices = new Set(vendor.servicesOffered);
    const overlap = [...projectServices].filter(service => vendorServices.has(service));
    const servicesOverlap = overlap.length;

    const slaWeight = Math.max(0, 10 - (vendor.responseSlaHours / 24) * 5);
    const score = (servicesOverlap * 2) + vendor.rating + slaWeight;

    return Math.round(score * 100) / 100;
  }

  private async seedDocuments(projects: Project[]): Promise<Document[]> {
    const documentsData = [
      {
        title: 'German Market Analysis 2024',
        content: 'Comprehensive analysis of the German SaaS market including competitor landscape, regulatory requirements, and growth opportunities. Key findings indicate strong demand for cloud-based solutions with emphasis on data privacy and GDPR compliance.',
        tags: ['market-research', 'germany', 'saas', 'gdpr'],
        projectId: projects[0].id,
      },
      {
        title: 'GDPR Compliance Checklist',
        content: 'Detailed checklist for GDPR compliance when operating in European markets. Covers data processing agreements, privacy policies, consent mechanisms, and breach notification procedures.',
        tags: ['legal-compliance', 'gdpr', 'privacy', 'checklist'],
        projectId: projects[0].id,
      },
      {
        title: 'UK Fintech Regulatory Overview',
        content: 'Overview of UK financial services regulations including FCA requirements, PCI DSS compliance, and Open Banking standards. Essential reading for fintech market entry.',
        tags: ['regulatory-consulting', 'fintech', 'uk', 'fca'],
        projectId: projects[1].id,
      },
      {
        title: 'Japanese Business Culture Guide',
        content: 'Cultural insights for doing business in Japan including meeting etiquette, decision-making processes, relationship building, and communication styles. Critical for successful market entry.',
        tags: ['cultural-consulting', 'japan', 'business-culture'],
        projectId: projects[2].id,
      },
      {
        title: 'Brazilian E-commerce Market Report',
        content: 'Analysis of Brazilian e-commerce landscape including market size, consumer behavior, payment preferences, logistics challenges, and key competitors.',
        tags: ['market-research', 'brazil', 'ecommerce', 'consumer-behavior'],
        projectId: projects[3].id,
      },
      {
        title: 'Nordic Tech Ecosystem Overview',
        content: 'Overview of the Nordic technology ecosystem including startup landscape, government digitization initiatives, and integration opportunities with existing tech infrastructure.',
        tags: ['tech-integration', 'nordic', 'ecosystem', 'digitization'],
        projectId: projects[4].id,
      },
    ];

    const documents = [];
    for (const docData of documentsData) {
      const document = new this.documentModel(docData);
      documents.push(await document.save());
    }

    return documents;
  }
}