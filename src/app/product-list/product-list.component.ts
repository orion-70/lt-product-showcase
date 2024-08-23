import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';

import { ButtonModule } from 'primeng/button';

import { Product, ProductsResponse } from '../models/product-models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    CommonModule,
    ButtonModule
  ],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  productsResponse: ProductsResponse | null = null;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.productsResponse = data,
      error: (err) => this.error = err.message
    });
  }
}