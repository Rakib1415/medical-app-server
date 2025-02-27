import { Controller, Get } from '@nestjs/common';
import { PatientService } from './patient.service';
import { ApiResponse } from '@nestjs/swagger';
import { Patient } from './patient.entity';

@Controller('patient')
export class PatientController {
    constructor(private readonly patentService: PatientService) {}

    @Get()
    @ApiResponse({
      status: 200,
      description: 'Successfully retrieved all patients.',
      type: [Patient],
      example: {
        code: 200,
        message: 'Patients retrieved successfully!',
        data: [
          {
            id: 1,
            userId: 1,
           currentMedications: []
          },
          {
            id: 2,
            userId: 2,
            currentMedications: []
          },
        ],
      },
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error. An unexpected error occurred.',
      type: Patient,
      example: {
        code: 500,
        message: 'Internal Server Error!',
        data: null,
      },
    })
  
    async getAllPatients(): Promise<Patient[]> {
      return this.patentService.findAll();
    }
}
