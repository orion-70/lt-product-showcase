import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ProductService } from '../services/product.service';
import { Router, NavigationEnd, ActivatedRoute, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsResponse } from '../models/product-models';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: any;
  let routerEventsSubject: Subject<any>;
  let activatedRouteSpy: any;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();

    const routerMock = {
      navigate: jasmine.createSpy('navigate'),
      events: routerEventsSubject.asObservable(),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({} as UrlTree),
      serializeUrl: jasmine.createSpy('serializeUrl').and.returnValue(''),
      url: '',
      isActive: jasmine.createSpy('isActive').and.returnValue(false),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {},
      params: of({}),
      queryParams: of({})
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MenubarModule,
        InputTextModule,
        HeaderComponent
      ],
      providers: [
        ProductService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as any;
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items', () => {
    expect(component.items.length).toBe(2);
    expect(component.items[0].label).toBe('Home');
    expect(component.items[1].label).toBe('Products');
  });

  it('should search products when input changes', fakeAsync(() => {
    // Spies
    const mockResults = new ProductsResponse({
      products: [{ id: 1, title: 'Test Product' }]
    });
    spyOn(component.productService, 'quickSearchProducts').and.returnValue(of(mockResults));

    // On init and search
    component.ngOnInit();
    component.searchControl.setValue('test');
    tick(300);

    // Expectations
    expect(component.productService.quickSearchProducts).toHaveBeenCalledWith('test');
    expect(component.searchResults.products.length).toBe(1);
    expect(component.searchResults.products[0].title).toBe('Test Product');
  }));

  it('should filter search results by title', fakeAsync(() => {
    // Spies
    const mockResults = new ProductsResponse({
      products: [
        { id: 1, title: 'Test Product', description: 'Test Description' },
        { id: 2, title: 'Another Product', description: 'Test' }
      ]
    });
    spyOn(component.productService, 'quickSearchProducts').and.returnValue(of(mockResults));

    // On init and search
    component.ngOnInit();
    component.searchControl.setValue('test');
    tick(300);

    // Expectations
    expect(component.searchResults.products.length).toBe(1);
    expect(component.searchResults.products[0].title).toBe('Test Product');
    expect(component.searchResults.products[0].description).toBe('Test Description');
  }));

  it('should navigate to product page when product is selected', () => {
    // Select product
    const mockProduct = { id: 1, title: 'Test Product' };
    component.onSelectProduct(mockProduct);

    // Expectations
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/product', 1]);
    expect(component.searchResults.products.length).toBe(0);
  });

  it('should reset search control on navigation', fakeAsync(() => {
    // Spies
    spyOn(component.searchControl, 'reset');

    // On init and navigation
    component.ngOnInit();
    routerEventsSubject.next(new NavigationEnd(1, '/', '/'));
    tick(300);

    // Expectations
    expect(component.searchControl.reset).toHaveBeenCalled();
  }));

  it('should clear search results when clicking outside', () => {
    // Set search results
    component.searchResults = new ProductsResponse({ products: [{ id: 1, title: 'Test Product' }] });

    // Click outside
    const mockEvent = new MouseEvent('click');
    Object.defineProperty(mockEvent, 'target', { value: document.body });
    component.onDocumentClick(mockEvent);

    // Expectations
    expect(component.searchResults.products.length).toBe(0);
  });
});