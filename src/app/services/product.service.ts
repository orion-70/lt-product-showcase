import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    let params = new HttpParams()
      .set('q', filter)
      .set('limit', limit.toString())
      .set('skip', skip.toString())
      .set('sortBy', sortBy || 'title')
      .set('order', order || 'asc')
      .set('select', 'title,price,thumbnail,discountPercentage,rating,category,stock,description');
    if (category) {
      return this.http.get<any>(`${this.apiUrl}/category/${category}`, { params });
    }
    return this.http.get<any>(`${this.apiUrl}/search?`, { params });
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
    let params = new HttpParams()
      .set('q', query)
      .set('select', 'title')
      .set('sortBy', 'title');
    return this.http.get<any>(`${this.apiUrl}/search?`, { params });
  }

  /**
   * Retrieves all product categories.
   * @returns An observable that emits an array of strings representing the product categories.
   */
  getAllProductCategories(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/category-list`);
  }
}
