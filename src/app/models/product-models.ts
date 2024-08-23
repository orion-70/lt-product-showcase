export class Product {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand: string;
    sku: string;
    weight: number;
    dimensions: Dimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: Review[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: Meta;
    images: string[];
    thumbnail: string;

    constructor(data: any) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.category = data.category;
        this.price = data.price;
        this.discountPercentage = data.discountPercentage;
        this.rating = data.rating;
        this.stock = data.stock;
        this.tags = data.tags;
        this.brand = data.brand;
        this.sku = data.sku;
        this.weight = data.weight;
        this.dimensions = new Dimensions(data.dimensions);
        this.warrantyInformation = data.warrantyInformation;
        this.shippingInformation = data.shippingInformation;
        this.availabilityStatus = data.availabilityStatus;
        this.reviews = data.reviews.map((review: any) => new Review(review));
        this.returnPolicy = data.returnPolicy;
        this.minimumOrderQuantity = data.minimumOrderQuantity;
        this.meta = new Meta(data.meta);
        this.images = data.images;
        this.thumbnail = data.thumbnail;
    }

    getDiscountedPrice(): number {
        return this.price - (this.price * (this.discountPercentage / 100));
    }

    isAvailable(): boolean {
        return this.stock > 0;
    }

    getAverageReviewRating(): number {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        return totalRating / this.reviews.length;
    }
}

export class Dimensions {
    width: number;
    height: number;
    depth: number;

    constructor(data: any) {
        this.width = data.width;
        this.height = data.height;
        this.depth = data.depth;
    }
}

export class Review {
    rating: number;
    comment: string;
    date: Date;
    reviewerName: string;
    reviewerEmail: string;

    constructor(data: any) {
        this.rating = data.rating;
        this.comment = data.comment;
        this.date = new Date(data.date);
        this.reviewerName = data.reviewerName;
        this.reviewerEmail = data.reviewerEmail;
    }
}

export class Meta {
    createdAt: Date;
    updatedAt: Date;
    barcode: string;
    qrCode: string;

    constructor(data: any) {
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.barcode = data.barcode;
        this.qrCode = data.qrCode;
    }
}

export class ProductsResponse {
    products: Product[];

    constructor(data: any) {
        this.products = data.products.map((product: any) => new Product(product));
    }

    getProductById(id: number): Product | undefined {
        return this.products.find(product => product.id === id);
    }

    getTotalStock(): number {
        return this.products.reduce((acc, product) => acc + product.stock, 0);
    }

    getAvailableProducts(): Product[] {
        return this.products.filter(product => product.isAvailable());
    }

    getAllCategories(): string[] {
        return this.products.map(product => product.category);
    }

    getProductsByCategory(category: string): Product[] {
        return this.products.filter(product => product.category === category);
    }

    getAllTags(): string[] {
        return this.products.reduce((acc: string[], product) => [...acc, ...product.tags], []);
    }

    getProductsByTag(tag: string): Product[] {
        return this.products.filter(product => product.tags.includes(tag));
    }

    searchProducts(query: string): Product[] {
        return this.products.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
    }
}