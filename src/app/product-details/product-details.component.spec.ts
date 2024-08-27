import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductDetailsComponent } from './product-details.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product-models';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let route: ActivatedRoute;
  let fixedDate: Date;

  beforeAll(() => {
    // The meta data for the 'should fetch product by id' test occasionally fails due to the Date object.
    // To prevent this, we mock the Date object to a fixed date.
    fixedDate = new Date('2024-08-26T22:06:29.000Z');
    jasmine.clock().install();
    jasmine.clock().mockDate(fixedDate);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
          },
        },
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  afterAll(() => {
    // Restore the original Date object
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product by id', () => {
    // Spies
    spyOn(component.productService, 'getProductById').and.returnValue(of(
      new Product({ id: '123', name: 'Test Product' }
    )));

    // On init and fetch product
    component.ngOnInit();
    component.fetchProductById('123');

    // Expectations
    expect(component.productService.getProductById).toHaveBeenCalledWith('123');
    expect(component.product).toEqual(new Product({ id: '123', name: 'Test Product' }));
  });
});
