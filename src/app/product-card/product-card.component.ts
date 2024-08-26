import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
  @Input() filterTitle: string = '';
  htmlContent: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.htmlContent = this.htmlTitle();
    this.cdr.detectChanges();
  }

  descriptionContainsFilter(): boolean {
    if (!this.filterTitle || this.filterTitle.length === 0 || !this.product?.description || this.product?.description.length === 0) {
      return false;
    }
    return this.product?.description.toLowerCase().includes(this.filterTitle.trim().toLowerCase()) && !this.product?.title.toLowerCase().includes(this.filterTitle.trim().toLowerCase());
  }

  htmlTitle(): string {
    if (this.filterTitle && this.filterTitle.length > 0 && this.product?.title.toLowerCase().includes(this.filterTitle.toLowerCase())) {
      return this.highlightFilter(this.product?.title) || '';
    }
    return this.product?.title || '';
  }

  htmlDescription(): string {
    if (!this.filterTitle || this.filterTitle.length === 0 || !this.product?.description || this.product?.description.length === 0) {
      return '';
    }
    // If the filter is a phrase spanning a space, return just the phrase surrounded by ellipses
    if (this.filterTitle.includes(' ')) {
      return `...<span class="highlight">${this.filterTitle}</span>...`;
    }
    // If the filter is a single word, return the single word with the matching filter highlighted
    const words = this.product?.description.split(' ');
    let word = words.find((w) => w.toLowerCase().includes(this.filterTitle.trim().toLowerCase())) || '';
    return this.highlightFilter(word) || '';
  }

  private highlightFilter(string: string | undefined) {
    const match = string?.match(new RegExp(this.filterTitle, 'gi'));
    match?.forEach((m) => {
      if (this.product && m && m.length > 0) {
        string = string?.replace(m, `<span class="highlight">${m}</span>`);
      }
    });
    return string;
  }
}