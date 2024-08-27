import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch paged product cards with category filter', () => {
    // Dummy data
    const dummyProducts = { products: [{ title: 'Product 1' }, { title: 'Product 2' }] };
    const limit = 10;
    const skip = 0;
    const sortBy = 'price';
    const order = 'desc';
    const category = 'electronics';

    // Call the API
    service.getPagedProductCards(limit, skip, sortBy, order, category).subscribe((products) => {
      expect(products).toEqual(dummyProducts);
    });

    // Expectations
    const query = `/category/${category}/?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}&select=title,price,thumbnail,discountPercentage,rating,category,stock,description`;
    const req = httpMock.expectOne(`${service['apiUrl']}${query}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should fetch paged product cards with search filter', () => {
    // Dummy data
    const dummyProducts = { products: [{ title: 'Product 1' }, { title: 'Product 2' }] };
    const limit = 10;
    const skip = 0;
    const sortBy = 'price';
    const order = 'desc';
    const search = 'phone';

    // Call the API
    service.getPagedProductCards(limit, skip, sortBy, order, '', search).subscribe((products) => {
      expect(products).toEqual(dummyProducts);
    });

    // Expectations
    const query = `/search?q=${search}&limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}&select=title,price,thumbnail,discountPercentage,rating,category,stock,description`;
    const req = httpMock.expectOne(`${service['apiUrl']}${query}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should fetch a product by ID', () => {
    // Dummy data
    const dummyProduct = { title: 'Product 1' };
    const productId = '1';

    // Call the API
    service.getProductById(productId).subscribe((product) => {
      expect(product).toEqual(dummyProduct);
    });

    // Expectations
    const req = httpMock.expectOne(`${service['apiUrl']}/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });

  it('should perform a quick search for products', () => {
    // Dummy data
    const dummyResults = { products: [{ title: 'Product 1' }] };
    const query = 'phone';

    // Call the API
    service.quickSearchProducts(query).subscribe((results) => {
      expect(results).toEqual(dummyResults);
    });

    // Expectations
    const req = httpMock.expectOne(`${service['apiUrl']}/search?q=${query}&select=title&sortBy=title`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResults);
  });

  it('should fetch all product categories', () => {
    // Dummy data
    const dummyCategories = ['electronics', 'furniture', 'clothing'];

    // Call the API
    service.getAllProductCategories().subscribe((categories) => {
      expect(categories).toEqual(dummyCategories);
    });

    // Expectations
    const req = httpMock.expectOne(`${service['apiUrl']}/category-list`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

});
