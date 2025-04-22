import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChipsAutocompleteComponent } from './custom-chips-autocomplete.component';

describe('CustomChipsAutocompleteComponent', () => {
  let component: CustomChipsAutocompleteComponent;
  let fixture: ComponentFixture<CustomChipsAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomChipsAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomChipsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
