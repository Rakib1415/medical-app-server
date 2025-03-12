import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiResponse({ status: 201, description: 'Appointment successfully created', type: Appointment })
  @ApiResponse({ status: 404, description: 'Doctor or Patient not found' })
  async create(@Body() dto: CreateAppointmentDto){
   
    const data = this.appointmentService.createAppointment(dto);
    return {
        code : '201',
        message : "Appointment created successfully!",
        data,
        status : true,
       }
  }
  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all appointments for a specific patient' })
  @ApiParam({ name: 'patientId', example: 2, description: 'ID of the patient' })
  @ApiResponse({ status: 200, description: 'List of appointments', type: [Appointment] })
  async getByPatient(@Param('patientId') patientId: number): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatient(patientId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get all appointments for a specific doctor' })
  @ApiParam({ name: 'doctorId', example: 1, description: 'ID of the doctor' })
  @ApiResponse({ status: 200, description: 'List of appointments', type: [Appointment] })
  async getByDoctor(@Param('doctorId') doctorId: number): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByDoctor(doctorId);
  }
}

