import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListFilterDTO {
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  public page: number = null;

  @Transform(({ value }) => Math.min(10, Number(value)))
  @IsNumber()
  public perPage: number = null;

  @IsEnum(SortOrder)
  @IsOptional()
  public sort?: SortOrder = SortOrder.DESC;

  @IsOptional()
  public search?: string = null;
}
