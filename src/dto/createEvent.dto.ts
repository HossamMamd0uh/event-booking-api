import { IsString, IsNotEmpty, IsDate, IsInt, Min, Length, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDTO {
    @IsNotEmpty({ message: 'Event name is required.' })
    @Length(0,100)
    name: string;

    description: string;

    @IsInt({ message: 'Available attendees count must be an integer.' })
    @Max(1000, { message: 'Available attendees count must not exceed 1000.' })
    availableAttendeesCount: number;

    @IsDate({ message: 'Date must be a valid date.' })
    @Type(() => Date)  
    date: Date;

    @IsNotEmpty({ message: 'Category is required.' })
    @IsNumber({}, { message: 'Category must be a valid number.' })
    category : number;  
}