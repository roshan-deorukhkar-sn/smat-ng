import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmheaderComponent } from './smheader.component';

describe('SmheaderComponent', () => {
  let component: SmheaderComponent;
  let fixture: ComponentFixture<SmheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
