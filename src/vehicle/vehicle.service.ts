import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleDto } from './dto/vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicle: Repository<Vehicle>,
  ) {}
  async create(vehicleDto: VehicleDto, id?: string): Promise<Vehicle> {
    let vehicleDao = new Vehicle();

    if (id) {
      const vehicle = await this.findOne(id);
      if (!vehicle) throw new NotFoundException(`vehicle not found`);
      vehicleDao = vehicle;
    }
    vehicleDao.vehicleNumber = vehicleDto.vehicleNumber;
    vehicleDao.fuelType = vehicleDto.fuelType;
    vehicleDao.model = vehicleDto.model;
    vehicleDao.capacity = vehicleDto.capacity;
    vehicleDao.category = vehicleDto.category;
    vehicleDao.containerType = vehicleDto.containerType;
    return await this.vehicle.save(vehicleDao);
  }
  async findAll(): Promise<Vehicle[]> {
    return await this.vehicle.find();
  }
  async findOne(id: string): Promise<Vehicle> {
    return await this.vehicle.findOne(id);
  }
  async delete(id: string): Promise<void> {
    await this.vehicle.update({ id }, { deleted: true });
  }
}
