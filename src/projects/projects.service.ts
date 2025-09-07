import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(user?: any): Promise<Project[]> {
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.matches', 'matches');

    // If user is a client, only show their projects
    if (user && user.role === UserRole.CLIENT) {
      query.where('client.userId = :userId', { userId: user.id });
    }

    return query.getMany();
  }

  async findOne(id: number, user?: any): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'matches', 'matches.vendor'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Check if user has access to this project
    if (user && user.role === UserRole.CLIENT) {
      if (project.client.userId !== user.id) {
        throw new ForbiddenException('Access denied to this project');
      }
    }

    return project;
  }

  async findByClientId(clientId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { clientId },
      relations: ['matches'],
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user?: any): Promise<Project> {
    const project = await this.findOne(id, user);
    
    await this.projectRepository.update(id, updateProjectDto);
    return this.findOne(id, user);
  }

  async remove(id: number, user?: any): Promise<void> {
    const project = await this.findOne(id, user);
    
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async findActiveProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { status: ProjectStatus.ACTIVE },
      relations: ['client'],
    });
  }
}