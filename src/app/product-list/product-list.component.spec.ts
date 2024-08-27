import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        ReactiveFormsModule
      ],
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch categories and format them on initialization', fakeAsync(() => {
    // Spies
    spyOn(component, 'fetchCategories').and.callThrough();
    spyOn(component.productService, 'getAllProductCategories').and.returnValue(of(['category-1', 'category-2']));

    // On init
    component.ngOnInit();

    // Expectations
    expect(component.fetchCategories).toHaveBeenCalled();
    expect(component.productService.getAllProductCategories).toHaveBeenCalled();
    expect(component.categoryOptions).toEqual([
      {
        category_name: 'All products',
        category_value: ''
      },
      {
        category_name: 'Category 1',
        category_value: 'category-1'
      },
      {
        category_name: 'Category 2',
        category_value: 'category-2'
      }
    ]);
  }));

  it('should fetch products on initialization', fakeAsync(() => {
    // Spies
    spyOn(component, 'fetchProducts').and.callThrough();
    spyOn(component.productService, 'getPagedProductCards').and.callThrough();

    // On init
    component.ngOnInit();

    // Expectations
    expect(component.fetchProducts).toHaveBeenCalled();
    expect(component.productService.getPagedProductCards).toHaveBeenCalled();
  }));

  it('should fetch products when filter form changes', fakeAsync(() => {
    // Spies
    spyOn(component, 'fetchProducts').and.callThrough();
    spyOn(component.productService, 'getPagedProductCards').and.callThrough();

    // On init and form change
    component.ngOnInit();
    component.filterFormGroup.patchValue({ filterTitle: 'test' });
    tick(300);

    // Expectations
    expect(component.fetchProducts).toHaveBeenCalled();
    expect(component.productService.getPagedProductCards).toHaveBeenCalled();
  }));

  it('should fetch products with correct parameters', () => {
    // Spies
    spyOn(component.productService, 'getPagedProductCards').and.returnValue(of({
      products: [],
      total: 0
    }));

    // Fetch products
    component.fetchProducts();

    // Expectations
    expect(component.productService.getPagedProductCards).toHaveBeenCalledWith(
      component.limit,
      component.skip,
      component.selectedSortBy,
      component.selectedOrder,
      component.selectedCategory,
      component.filterTitle
    );
  });
});