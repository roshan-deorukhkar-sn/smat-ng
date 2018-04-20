import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmfooterComponent } from './smfooter.component';

describe('SmfooterComponent', () => {
  let component: SmfooterComponent;
  let fixture: ComponentFixture<SmfooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmfooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
