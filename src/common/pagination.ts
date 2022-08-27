import { PlatformEntity } from './platform.entity';

export class PaginatedResponse {
  constructor(public data: PlatformEntity[], public page: Page) { }
}

export class Page {
  public hasNext: boolean;

  constructor(public count: number, public page: number, public limit: number) {
    const totalPages = count / limit;
    this.hasNext = totalPages > page;
  }
}
