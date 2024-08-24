import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

import { ButtonModule } from 'primeng/button';

import { Product, ProductsResponse } from '../models/product-models';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    ProductCardComponent
],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  productsResponse: ProductsResponse | null = null;
  error: string | null = null;
  @Input() products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productsResponse = new ProductsResponse(data);
        this.products = this.productsResponse.products;
      },
      error: (err) => this.error = err.message
    });
  }

  onClickGoToProductDetails(id: string): void {
    this.router.navigate(['/product', id]);
  }
}