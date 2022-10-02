import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderBy {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: string;
}

export class SearchBy {
  @IsOptional()
  @IsString()
  columnName?: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class QueryDto {
  @IsArray()
  @Type(() => OrderBy)
  @ValidateNested()
  @IsOptional()
  orderBy?: OrderBy[];

  public static transformToQuery(queryDto: QueryDto) {
    if (queryDto.orderBy == undefined) return {};
    return {
      asc: queryDto.orderBy.filter(e => e.order == 'ASC').map(e => e.name),
      desc: queryDto.orderBy.filter(e => e.order == 'DESC').map(e => e.name),
    };
  }

  @IsArray()
  @Type(() => SearchBy)
  @ValidateNested()
  @IsOptional()
  searchColumn?: SearchBy[];
  public static transforSearchQuery(searchDto: SearchBy[]): SearchBy[] {
    if (searchDto == undefined) return [{}];
    return searchDto.map(searchQuery => {
      return {
        columnName: searchQuery.columnName
          .split(/(?=[A-Z])/)
          .join('_')
          .toLowerCase(),
        value: searchQuery.value,
      };
    });
  }
}
