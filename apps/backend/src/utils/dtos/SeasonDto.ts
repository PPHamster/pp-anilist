import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class SeasonCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public title: string;

  @IsInt()
  @Min(0)
  public sequence: number;

  @IsInt()
  @Min(0)
  public chapterCount: number;
}

export class SeasonUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  public sequence?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  public chapterCount?: number;
}
