import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteBuilderComponent } from './quote-builder.component';

describe('QuoteBuilderComponent', () => {
  let component: QuoteBuilderComponent;
  let fixture: ComponentFixture<QuoteBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
