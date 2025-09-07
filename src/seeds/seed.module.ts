import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { SeedService } from './seed.service';
import { User } from '../auth/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Project } from '../projects/entities/project.entity';
import { Match } from '../matches/entities/match.entity';
import { Document, DocumentSchema } from '../documents/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, Vendor, Project, Match]),
    MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}