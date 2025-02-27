import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dtos/create-patient.dto';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepository: Repository<Patient>,
      ) {}


  async create(createPatientDto : Partial<CreatePatientDto>): Promise<Patient> {
    const patient = this.patientRepository.create();
    patient.userId = createPatientDto.userId;
    if(createPatientDto.currentMedication){
        patient.currentMedications = [createPatientDto.currentMedication]
    }
    if(createPatientDto.operationHistory){
      patient.operationHistories = [createPatientDto.operationHistory]
  }
  if(createPatientDto.healthStatus){
    patient.healthStatuses = [createPatientDto.healthStatus]
}
    return this.patientRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    
    return this.patientRepository.createQueryBuilder('patient').leftJoinAndSelect('patient.currentMedications', 'currentMedications').leftJoinAndSelect('patient.operationHistories', 'operationHistories').leftJoinAndSelect('patient.healthStatuses', 'healthStatuses').leftJoin('patient.userId', 'user').addSelect(['user.id', 'user.username', 'user.email']).getMany();
  }

  async findByUserId(userId: number): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { userId }, relations: ['userId', 'currentMedications', 'operationHistories', 'healthStatuses'] });
  }
  async findOne(id: number): Promise<Patient | null> {
    return this.patientRepository.findOne({ where: { id } });
  }

  async update(id: number, patientData: Partial<Patient>): Promise<Patient> {
    const patient = await this.findOne(id);
    if(!patient){
      throw new BadRequestException('Patient Not Found!')
    }
    Object.assign(patient, patientData)
    return this.patientRepository.save(patient);
  }
    
}
