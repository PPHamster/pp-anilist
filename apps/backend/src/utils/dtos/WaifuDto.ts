import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class WaifuCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public nameEn: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public nameTh: string;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsInt()
  @Min(0)
  @Max(5)
  public level: number;

  @IsNotEmpty()
  @IsString()
  public image: string;
}

export class WaifuUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public nameEn: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  public nameTh: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  public level: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public image: string;
}
