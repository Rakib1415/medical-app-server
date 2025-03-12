import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '@/doctor/doctor.entity';
import { Patient } from '@/patient/patient.entity';
import { Report } from '@/report/report.entity';
import { Prescription } from '@/prescription/prescription.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,

    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
  ) {}

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    const { doctorId, patientId, reports, prescriptions, accessTime } = dto;
  
    const doctor = await this.doctorRepository.findOne({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
  
    const patient = await this.patientRepository.findOne({ where: { id: patientId } });
    if (!patient) throw new NotFoundException('Patient not found');
  
    const reportEntities = reports.length
      ? await this.reportRepository.find({
          where: reports.map(id => ({ id })),
        })
      : [];
  
    const prescriptionEntities = prescriptions.length
      ? await this.prescriptionRepository.find({
          where: prescriptions.map(id => ({ id })),
        })
      : [];
  
    const appointment = this.appointmentRepository.create({
      doctor,
      patient,
      reports: reportEntities,
      prescriptions: prescriptionEntities,
      accessTime,
    });
  
    return this.appointmentRepository.save(appointment);
  }

  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.userId', 'reports', 'prescriptions'],
    });
  }
  
  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.userId', 'reports', 'prescriptions'],
    });
  }
  
  
}

