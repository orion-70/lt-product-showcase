import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import { ProductService } from '../services/product.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { Product, ProductsResponse } from '../models/product-models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  searchControl = new FormControl();
  searchResults: ProductsResponse | null = null;
  private routerSubscription: Subscription | null = null;

  @ViewChild('searchInput') searchInput: ElementRef | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/'
      },
      {
        label: 'Products',
        icon: 'pi pi-fw pi-objects-column',
        routerLink: '/products'
      }
    ];

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.productService.quickSearchProducts(value))
    ).subscribe(results => {
      this.assignSearchResults(results);
    });

    document.addEventListener('click', this.onDocumentClick.bind(this));

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.searchControl.reset();
    });
  }

  private assignSearchResults(results: any, maxResults = 5) {
    this.searchResults = new ProductsResponse(results);
    this.searchResults.products = this.searchResults.products.filter((product: Product) => {
      // The endpoint filters by title and description, but we only want to show products that match the title
      return product.title.toLowerCase().includes(this.searchControl.value.toLowerCase());
    }).slice(0, maxResults);
  }

  ngAfterViewInit() {
    this.searchInput?.nativeElement.addEventListener('click', this.onSearchInputClick.bind(this));
  }

  onSearchInputClick() {
    const searchValue = this.searchControl.value;
    if (searchValue && searchValue.length > 0) {
      this.productService.quickSearchProducts(searchValue).subscribe(results => {
        this.assignSearchResults(results);
      });
    }
  }

  onSelectProduct(product: any) {
    this.router.navigate(['/product', product.id]);
    this.searchResults = null;
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(target)) {
      this.searchResults = null;
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.searchInput) {
      this.searchInput.nativeElement.removeEventListener('click', this.onSearchInputClick.bind(this));
    }
  }
}