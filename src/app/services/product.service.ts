import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=0`);
  }

  getPagedProductCards(
    limit: number,
    skip: number,
    sortBy: string | null = 'title',
    order: string | null = 'asc',
    category: string | null = null,
    filter: string | null = ''
  ): Observable<any> {
    filter = filter?.trim() || '';
    let query = '';
    if (category) {
      query += `/category/${category}/`;
    }
    if (filter) {
      query += `/search?q=${filter}&`;
    } else {
      query += '?';
    }
    query += `limit=${limit}&skip=${skip}`;
    if (sortBy) {
      query += `&sortBy=${sortBy}`;
    }
    if (order) {
      query += `&order=${order}`;
    }
    query += '&select=title,price,thumbnail,discountPercentage,rating,category,stock,description';
    return this.http.get<any>(`${this.apiUrl}${query}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  quickSearchProducts(query: string): Observable<any> {
    if (!query) {
      return new Observable();
    }
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}&select=title&sortBy=title`);
  }

  getAllProductCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category-list`);
  }
}
