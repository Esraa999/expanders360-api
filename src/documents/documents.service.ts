import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Document } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SearchDocumentsDto } from './dto/search-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, file?: Express.Multer.File): Promise<Document> {
    const documentData = {
      ...createDocumentDto,
      fileName: file?.filename,
      fileSize: file?.size,
      mimeType: file?.mimetype,
    };

    const document = new this.documentModel(documentData);
    return document.save();
  }

  async findAll(): Promise<Document[]> {
    return this.documentModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByProject(projectId: number): Promise<Document[]> {
    return this.documentModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const document = await this.documentModel
      .findByIdAndUpdate(id, updateDocumentDto, { new: true })
      .exec();
    
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    
    return document;
  }

  async remove(id: string): Promise<void> {
    const result = await this.documentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  }

  async search(searchDto: SearchDocumentsDto): Promise<Document[]> {
    const { query, tags, projectId } = searchDto;
    
    let searchQuery: any = {};

    // Add project filter if specified
    if (projectId) {
      searchQuery.projectId = projectId;
    }

    // Add tag filter if specified
    if (tags && tags.length > 0) {
      searchQuery.tags = { $in: tags };
    }

    // Add text search if query is provided
    if (query) {
      searchQuery.$text = { $search: query };
    }

    const documents = await this.documentModel
      .find(searchQuery)
      .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .exec();

    return documents;
  }

  async getDocumentCountByProject(projectIds: number[]): Promise<{ [key: number]: number }> {
    const pipeline = [
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
    ];

    const results = await this.documentModel.aggregate(pipeline).exec();
    
    const countMap: { [key: number]: number } = {};
    results.forEach(result => {
      countMap[result._id] = result.count;
    });

    return countMap;
  }
}