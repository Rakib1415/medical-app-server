import { Controller, Post, Body, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@/users/users.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService, private readonly userService: UsersService) { }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all doctors.',
    type: [Doctor],
    example: {
      code: 200,
      message: 'Doctors retrieved successfully!',
      data: [
        {
          id: 1,
          userId: 1,
          educations: [],
          experiences: [],
        },
        {
          id: 2,
          userId: 2,
          educations: [],
          experiences: [],
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
    type: Doctor,
    example: {
      code: 500,
      message: 'Internal Server Error!',
      data: null,
    },
  })

  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Get('with-status')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all doctors.',
    type: [Doctor],
    example: {
      code: 200,
      message: 'Doctors retrieved successfully!',
      data: [
        {
          id: 1,
          userId: 1,
          educations: [],
          experiences: [],
        },
        {
          id: 2,
          userId: 2,
          educations: [],
          experiences: [],
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
    type: Doctor,
    example: {
      code: 500,
      message: 'Internal Server Error!',
      data: null,
    },
  })
  async getAllActiveDoctors() {
    return this.doctorService.getAllDoctorsWithStatus();
  }
  @Patch(':doctorId/approve')
  @ApiOperation({ summary: 'Approve or disapprove a doctor' })
  @ApiParam({ name: 'doctorId', example: 1, description: 'ID of the doctor' })
  @ApiResponse({ status: 200, description: 'Doctor approval status updated', type: Doctor })
  async updateApproval(
    @Param('doctorId') doctorId: number
  ) {

    const data = this.doctorService.updateApprovalStatus(doctorId);

    return {
      code: '200',
      message: "Doctor Approval successfully!",
      data,
      status: true,
    }
  }

}

