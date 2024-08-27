# LT Product Showcase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Data source

The project utilizes the [DummyJSON API](https://dummyjson.com/) as a mock data source for testing and development purposes. The API provides a variety of fake data. The "Products" endpoints are used in this project.

## Deployment

GitHub Pages were used to deploy a build for public access and testing. The npm package ['angular-cli-ghpages'](https://www.npmjs.com/package/angular-cli-ghpages) was used to streamline the process.

## Issues/Limitations

- Price sorting is not reliable because the data source only returns original price and discount percentage. It does not include the discount price and so I cannot sort by the actual price of the items due to pagination. I could make a call to get all products and then sort them on the front end, but that's not very efficient. If this were my own project I would modify the API endpoint to return the final discount price as well and allow sorting by that value.

- The search function in the product API searches both the product title and the description. It would be preferrable to have options to search each independently or combined, but I don't have control over that. The "quick search" feature I implemented in the main header does a front end filter by title after the initial API call to prevent having search results with titles that don't match the search term (due to the search term appearing in that product's description). The filter search on the products page however will match based on name or description and I felt it was reasonable enough to just label that input appropriately and highlight name and description matches on the product cards themselves.

- The search function is not compatible with the category filter in the product API. Similar to the above issues, I could solve this by filtering on the front end (or by changing the endpoint to support both), but I wanted to demonstrate pagination where only a subsection of products are being retrieved for a more efficient front end. To prevent errors, the name/description filter input gets cleared and disabled when any category other than "All products" is selected.

- Leaving and returning to the products page loses your sort and filter.

- The product detail pages are formatted/designed terribly. I only included them as another example of navigation and routing.

- Depending on your browser window size you are sometimes left with a few extra product cards on a new row aligned to the left. Would have liked to find a better solution that properly filled the row or at least looked symmetrical, but I abandoned for time and scope.