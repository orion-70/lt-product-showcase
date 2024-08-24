import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { Product } from '../models/product-models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    RatingModule
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
}