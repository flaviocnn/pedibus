import { TestBed } from '@angular/core/testing';

import { StopsService } from './stops.service';

describe('StopsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StopsService = TestBed.get(StopsService);
    expect(service).toBeTruthy();
  });
});
