import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto{


    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    limit?: number;

    @IsOptional()
    @IsPositive()
    @Type(()=>Number)
    page?: number;

    @IsOptional()
    @IsIn(['createdAt','dueDate'])
    sortBy?: string;

    @IsOptional()
    @IsIn(['asc','desc'])
    sortOrder?: 'asc' | 'desc';

}