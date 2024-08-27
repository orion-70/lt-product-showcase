import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves paged product cards based on the specified parameters.
   *
   * @param limit - The maximum number of product cards to retrieve.
   * @param skip - The number of product cards to skip.
   * @param sortBy - The field to sort the product cards by. Defaults to 'title'.
   * @param order - The sort order of the product cards. Defaults to 'asc'.
   * @param category - The category of the product cards. Defaults to null.
   * @param filter - The filter string to search for in the product cards. Defaults to null.
   * @returns An Observable that emits the paged product cards.
   */
  getPagedProductCards(
    limit: number,
    skip: number,
    sortBy: string | null = 'title',
    order: string | null = 'asc',
    category: string | null = null,
    filter: string | null = null
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

  /**
   * Retrieves a product by its ID.
   *
   * @param id - The ID of the product to retrieve.
   * @returns An observable that emits the product data.
   */
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Performs a quick search for product titles only, based on the provided query.
   *
   * @param query - The search query string.
   * @returns An Observable that emits the search results.
   */
  quickSearchProducts(query: string): Observable<any> {
    if (!query) {
      return new Observable();
    }
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}&select=title&sortBy=title`);
  }

  /**
   * Retrieves all product categories.
   * @returns An observable that emits an array of strings representing the product categories.
   */
  getAllProductCategories(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/category-list`);
  }
}
