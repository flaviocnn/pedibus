import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinebuilderComponent } from './linebuilder.component';

describe('LinebuilderComponent', () => {
  let component: LinebuilderComponent;
  let fixture: ComponentFixture<LinebuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinebuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinebuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
