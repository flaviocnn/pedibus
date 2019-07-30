import { TestBed } from '@angular/core/testing';

import { PedibusService } from "./PedibusService";

describe('PedibusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedibusService = TestBed.get(PedibusService);
    expect(service).toBeTruthy();
  });
});
