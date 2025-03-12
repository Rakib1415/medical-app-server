import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '@/doctor/doctor.entity';
import { Patient } from '@/patient/patient.entity';
import { Prescription } from '@/prescription/prescription.entity';
import { Report } from '@/report/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, Patient, Report, Prescription])],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
