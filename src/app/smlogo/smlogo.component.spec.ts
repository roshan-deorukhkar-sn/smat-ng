import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmlogoComponent } from './smlogo.component';

describe('SmlogoComponent', () => {
  let component: SmlogoComponent;
  let fixture: ComponentFixture<SmlogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmlogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
