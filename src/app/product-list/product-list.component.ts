import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { Product, ProductsResponse } from '../models/product-models';
import { ProductCardComponent } from "../product-card/product-card.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule,
    PaginatorModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ToggleButtonModule,
    ProductCardComponent
  ],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  productsResponse: ProductsResponse | null = null;
  error: string | null = null;
  @Input() products: Product[] = [];
  limit: number = 24;
  skip: number = 0;
  filterFormGroup: FormGroup;
  filterTitle: string = '';
  filterTitlePlaceholder: string = 'Find by name/description';
  categoryOptions: any[] | undefined = [];
  selectedCategory: string = '';
  sortByOptions: any[] = [
    {
      id: 0,
      sort_by_name: 'name',
      sort_by_value: 'title'
    },
    {
      id: 1,
      sort_by_name: 'price',
      sort_by_value: 'price'
    },
    {
      id: 2,
      sort_by_name: 'rating',
      sort_by_value: 'rating'
    },
    {
      id: 3,
      sort_by_name: 'stock',
      sort_by_value: 'stock'
    }
  ];
  selectedSortBy: string = 'title';
  selectedOrder: string = 'asc';

  @ViewChild('paginator', { static: true }) paginator: Paginator | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.filterFormGroup = new FormGroup({
      filterTitle: new FormControl(''),
      category: new FormControl(''),
      sortBy: new FormControl('title'),
      order: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();
    this.filterFormGroup.valueChanges.subscribe(values => {
      this.onFilterChange(values);
    });
  }

  /**
   * Fetches products and updates the component's state with the retrieved data.
   */
  fetchProducts(): void {
    this.selectedCategory = this.filterFormGroup.get('category')?.value;
    const filterTitleInput = this.filterFormGroup.get('filterTitle');
    if (this.selectedCategory !== '') {
      this.filterTitle = '';
      filterTitleInput?.setValue(this.filterTitle, { emitEvent: false });
      if (filterTitleInput?.enabled) {
        this.filterTitlePlaceholder = 'Category selected';
        filterTitleInput?.disable({ emitEvent: false });
      }
    } else {
      if (filterTitleInput?.disabled) {
        filterTitleInput?.enable({ emitEvent: false });
        this.filterTitlePlaceholder = 'Find by name/description';
      }
      this.filterTitle = filterTitleInput?.value;
    }
    this.selectedSortBy = this.filterFormGroup.get('sortBy')?.value;
    this.selectedOrder = this.filterFormGroup.get('order')?.value === true ? 'asc' : 'desc';

    this.productService.getPagedProductCards(this.limit, this.skip, this.selectedSortBy, this.selectedOrder, this.selectedCategory, this.filterTitle).subscribe({
      next: (data) => {
        this.error = null;
        this.productsResponse = new ProductsResponse(data);
        this.products = this.productsResponse.products;

        for (let i = 0; i < this.products.length; i++) {
          // These product thumbnails were not formatted correctly in the original data
          // I manually fixed them with local image replacements since I don't have access to the data source
          if (this.products[i].id == "6" || this.products[i].id == "9" || this.products[i].id == "19"
            || this.products[i].id == "121" || this.products[i].id == "122" || this.products[i].id == "123"
            || this.products[i].id == "124" || this.products[i].id == "125" || this.products[i].id == "126"
            || this.products[i].id == "127" || this.products[i].id == "128" || this.products[i].id == "131"
            || this.products[i].id == "132" || this.products[i].id == "133" || this.products[i].id == "134"
            || this.products[i].id == "135" || this.products[i].id == "136" || this.products[i].id == "167"
            || this.products[i].id == "168" || this.products[i].id == "169" || this.products[i].id == "170"
            || this.products[i].id == "171"
          ) {
            this.products[i].thumbnail = `${this.products[i].id}_thumbnail.png`;
          }
        }

        // Fix for paginator bug where it doesn't reset to the first page when the total number of products changes
        if (this.productsResponse && this.productsResponse.total > 0 && this.productsResponse.total < this.skip){
          this.skip = 0;
          this.paginator?.changePage(0);
        }
      },
      error: (err) => this.error = err.message
    });
  }

  /**
   * Fetches all product categories and updates the category options.
   */
  fetchCategories(): void {
    this.productService.getAllProductCategories().subscribe({
      next: (data) => {
        this.error = null;
        this.categoryOptions = data.map((category: any) => {
          return {
            category_name: category.charAt(0).toUpperCase() + category.replace(/-/g, " ").slice(1),
            category_value: category
          };
        });
        // Add an 'All' option to the beginning of the category options
        this.categoryOptions?.unshift({
          category_name: 'All products',
          category_value: ''
        });
      },
      error: (err) => this.error = err.message
    });
  }

  onPageChange(event: any): void {
    this.skip = event.first;
    this.fetchProducts();
  }

  onClickGoToProductDetails(id: string): void {
    this.router.navigate(['/product', id]);
  }

  onFilterChange(values: any): void {
    this.fetchProducts();
  }
}