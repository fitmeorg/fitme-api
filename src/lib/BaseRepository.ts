import { Model, Document, FilterQuery, Query } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Filter, PaginationOptions } from '@common/types';

type filterMap = {
  [operator: string]: (field: string, value: any) => any;
};
export class BaseRepository<T extends Document> {
  filterMap: filterMap = {
    '=': (field, value) => ({ [field]: value }),
    in: (field, value) => ({ [field]: { $in: value } }),
    gte: (field, value) => ({ [field]: { $gte: value } }),
    lt: (field, value) => ({ [field]: { $lt: value } }),
    gt: (field, value) => ({ [field]: { $gt: value } }),
    lte: (field, value) => ({ [field]: { $lte: value } }),
    search: (field, value) => ({ [field]: RegExp(value, 'i') }),
  };

  defaultPopulateOptions: string[];

  constructor(
    private readonly model: Model<T>,
    protected readonly entityName: string,
    private readonly privateFields: string[] = [],
  ) {}

  async create(createDto: Partial<T>): Promise<T> {
    const createdDocument = new this.model(createDto);
    return createdDocument.save();
  }

  private applyFilters(query: Query<any, any>, filters: Filter[]) {
    if (!filters) return query;
    filters.forEach((filter) => {
      const { operator, value, field } = filter;
      const filterFunction = this.filterMap[operator];
      if (!filterFunction) {
        throw new Error(`Unsupported filter operator: ${operator}`);
      }
      const filterObject = filterFunction(field, value);
      query.where(filterObject);
    });
    return query;
  }

  private applyPagination(
    query: Query<any, any>,
    offset: number,
    limit: number,
  ) {
    return query.skip(offset).limit(limit);
  }

  getPopulateOptions(populateOptions: string[]) {
    const populateFields = populateOptions.map((option) =>
      option.split('.').reverse(),
    );
    let populateObj;
    const populateArray = [];

    for (const fields of populateFields) {
      for (const index in fields) {
        if (index === '0') {
          populateObj = { path: fields[index] };
          continue;
        }
        populateObj = { path: fields[index], populate: populateObj };
      }
      populateArray.push(populateObj);
      populateObj = {};
    }

    return populateArray;
  }

  applyPopulate(query: Query<any, any>, populateStrings: string[]) {
    if (Array.isArray(populateStrings)) {
      const populateOptions = this.getPopulateOptions(populateStrings);
      return query.populate(populateOptions);
    }
    const populateOptions = this.defaultPopulateOptions;
    return query.populate(populateOptions);
  }

  async findAll(
    filter: FilterQuery<T> = {},
    paginationOptions?: PaginationOptions,
    populateOptions?: string[],
  ) {
    let page = 0;
    let limit = 10;
    let filters: Filter[];

    if (paginationOptions !== undefined) {
      page = paginationOptions.page;
      limit = paginationOptions.limit;
      filters = paginationOptions.filters;
    }

    const offset = (page - 1) * limit;

    let query = this.model.find(filter);

    query = this.applyFilters(query, filters);

    const countQuery = this.model.find(query.getFilter());

    if (offset >= 0 && limit >= 1) {
      query = this.applyPagination(query, offset, limit);
    }

    query = this.applyPopulate(query, populateOptions);

    const [data, total_count] = await Promise.all([
      query.exec(),
      countQuery.countDocuments().exec(),
    ]);

    return {
      data,
      page,
      limit,
      total_count,
    };
  }

  async findOne(
    filter: FilterQuery<T>,
    PopulateOptions?: string[],
  ): Promise<T> {
    const document = this.model.findOne(filter);
    return this.applyPopulate(document, PopulateOptions).exec();
  }

  async findAllSelect(filter: FilterQuery<T>, distinct?: any, limit?: number) {
    const aggregationPipeline = [];

    aggregationPipeline.push({ $match: filter });

    if (distinct) {
      aggregationPipeline.push({
        $group: {
          _id: `$${distinct}`,
        },
      });
    }

    if (limit) {
      aggregationPipeline.push({ $limit: limit });
    }

    const documents = await this.model.aggregate(aggregationPipeline);

    return documents;
  }

  async findOneOrFail(
    filter: FilterQuery<T>,
    PopulateOptions?: string[],
  ): Promise<T> {
    const document = this.model.findOne(filter);

    if (!document) {
      throw new NotFoundException(`${this.entityName} not found`);
    }
    return this.applyPopulate(document, PopulateOptions);
  }

  async findById(id: string, PopulateOptions?: string[]): Promise<T> {
    const document = this.model.findById(id);
    return this.applyPopulate(document, PopulateOptions).exec();
  }

  async findByIdOrFail(id: string, PopulateOptions?: string[]): Promise<T> {
    const document = this.model.findById(id);
    if (!document) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }
    return this.applyPopulate(document, PopulateOptions);
  }

  async update(
    id: string,
    updateDto: Partial<T>,
  ): Promise<{ previous: T; updated: T }> {
    const previous = await this.findByIdOrFail(id);

    this.privateFields.forEach((field) => {
      if (updateDto[field]) {
        delete updateDto[field];
      }
    });

    const updated = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    return { previous, updated };
  }

  async updateMany(
    filterSearch: FilterQuery<T>,
    filterUpdate: FilterQuery<T>,
    PopulateOptions?: string[],
  ): Promise<T> {
    const document = this.model.updateMany(filterSearch, filterUpdate);

    return this.applyPopulate(document, PopulateOptions).exec();
  }

  async remove(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softRemove(id: string): Promise<T> {
    return this.model
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
