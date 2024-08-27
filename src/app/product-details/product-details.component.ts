import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product-models';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.fetchProductById(productId);
      }
    });
  }

  fetchProductById(id: string): void {
    this.productService.getProductById(id).subscribe((data: any) => {
      this.product = new Product(data);
    });
  }
}