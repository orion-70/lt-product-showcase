import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import { Product } from '../models/product-models';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set htmlContent after ngAfterViewInit', () => {
    component.filterTitle = 'filter';
    component.product = new Product({ title: 'Product Title', description: 'Product Description' });
    component.ngAfterViewInit();
    expect(component.htmlContent).toBe(component.htmlTitle());
  });

  it('should return true if description contains filterTitle', () => {
    component.filterTitle = 'match';
    component.product = new Product({ title: 'Product Title', description: 'Product Match' });
    expect(component.descriptionContainsFilter()).toBe(true);
  });

  it('should return false if description does not contain filterTitle', () => {
    component.filterTitle = 'filter';
    component.product = new Product({ title: 'Product Title', description: 'Another Description' });
    expect(component.descriptionContainsFilter()).toBe(false);
  });

  it('should return highlighted html title if filterTitle matches product title', () => {
    component.filterTitle = 'prod';
    component.product = new Product({ title: 'Product Title', description: 'Product Description' });
    expect(component.htmlTitle()).toContain('<span class="highlight">Prod</span>');
  });

  it('should return no highlight span in product title if filterTitle matches no part of product title', () => {
    component.filterTitle = 'Filter';
    component.product = new Product({ title: 'Product Title', description: 'Product Description' });
    expect(component.htmlTitle()).toBe('Product Title');
  });

  it('should return highlighted html description if filterTitle matches a word in the description', () => {
    component.filterTitle = 'product';
    component.product = new Product({ title: 'Product Title', description: 'Product Description' });
    expect(component.htmlDescription()).toBe('<span class="highlight">Product</span>');
  });

  it('should return highlighted html description if filterTitle matches a phrase in the description', () => {
    component.filterTitle = 'duct des';
    component.product = new Product({ title: 'Product Title', description: 'Product Description' });
    expect(component.htmlDescription()).toBe('...<span class="highlight">duct des</span>...');
  });

  it('should return empty string if filterTitle does not match any word in the description', () => {
    component.filterTitle = 'Filter';
    component.product = new Product({ title: 'Product Title', description: 'Product Description' });
    expect(component.htmlDescription()).toBe('');
  });
});
