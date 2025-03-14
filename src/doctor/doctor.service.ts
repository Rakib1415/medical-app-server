import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { User } from 'src/users/users.entity';
import { CreateDoctorDto } from './dtos/create-doctor.dto';
import { CallGateway } from '@/call/call.gateway';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private callGateway: CallGateway,
  ) {}

  async create(createDoctorDto : Partial<CreateDoctorDto>): Promise<Doctor> {
    const doctor = this.doctorRepository.create();
    doctor.user = createDoctorDto.user;
    if(createDoctorDto.education){
      doctor.educations = [createDoctorDto.education]
    }
    if(createDoctorDto.experience){
      doctor.experiences = [createDoctorDto.experience]
    }
    return this.doctorRepository.save(doctor);
  }

  async getAllDoctorsWithStatus() {
    const doctors = await this.findAll();
    const activeDoctors = this.callGateway.getActiveDoctors();

    return doctors.map((doctor) => ({
      ...doctor,
      isActive: activeDoctors.has(doctor.id),
      callerId: activeDoctors.get(doctor.id) || null, // Include callerId if present
    }));
  }

  async findAll(): Promise<Doctor[]> {
    
    return this.doctorRepository.createQueryBuilder('doctor').leftJoinAndSelect('doctor.educations', 'educations').leftJoinAndSelect('doctor.experiences', 'experiences').leftJoin('doctor.user', 'user').addSelect(['user.id', 'user.username', 'user.email']).getMany();
  }
  async findByUserId(userId: number): Promise<Doctor | null> {
    return this.doctorRepository.findOne({ 
      where: { user: { id: userId } },  // Fix: Query inside the relation
      relations: ['user', 'educations', 'experiences'] // Fix: Correct relation names
    });
  }
  
async findOne(id: number): Promise<Doctor | null> {
  return this.doctorRepository.findOne({ where: { id } });
}

  async update(id: number, doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.findOne(id);
    if(!doctor){
      throw new BadRequestException('Doctor Not Found!')
    }
    Object.assign(doctor, doctorData)
    return this.doctorRepository.save(doctor);
  }

  async delete(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }

  async updateApprovalStatus(doctorId: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.isApproved = true;
    return this.doctorRepository.save(doctor);
  }
}

