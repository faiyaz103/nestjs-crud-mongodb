import {IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional} from 'class-validator'
export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string

    @IsEnum(['Pending', 'InProgress', 'Completed'], {
        message: 'status must be either Pending, InProgress, or Completed'
    })
    @IsOptional()
    status?: string
    
    @IsDateString()
    @IsNotEmpty()
    dueDate: string
}
