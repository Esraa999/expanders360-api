import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find({
      where: { isActive: true },
      relations: ['matches'],
    });
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['matches'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    await this.vendorRepository.update(id, updateVendorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.vendorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
  }

  async findMatchingVendors(country: string, servicesNeeded: string[]): Promise<Vendor[]> {
    const query = this.vendorRepository.createQueryBuilder('vendor')
      .where('vendor.isActive = :isActive', { isActive: true })
      .andWhere('JSON_CONTAINS(vendor.countriesSupported, :country)', { 
        country: JSON.stringify(country) 
      });

    // Add service overlap condition
    if (servicesNeeded.length > 0) {
      const serviceConditions = servicesNeeded.map((service, index) => 
        `JSON_CONTAINS(vendor.servicesOffered, :service${index})`
      ).join(' OR ');
      
      query.andWhere(`(${serviceConditions})`);
      
      servicesNeeded.forEach((service, index) => {
        query.setParameter(`service${index}`, JSON.stringify(service));
      });
    }

    return query.getMany();
  }
}