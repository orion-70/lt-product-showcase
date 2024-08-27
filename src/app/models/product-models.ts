export class Product {
    id: string;
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
        this.reviews = data.reviews?.map((review: any) => new Review(review));
        this.returnPolicy = data.returnPolicy;
        this.minimumOrderQuantity = data.minimumOrderQuantity;
        this.meta = new Meta(data.meta);
        this.images = data.images;
        this.thumbnail = data.thumbnail;
    }

    getOriginalPrice(): string {
        return this.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    getDiscountedPrice(): string {
        const discountedPrice = this.price - (this.price * (this.discountPercentage / 100));
        return discountedPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
}

export class Dimensions {
    width: number;
    height: number;
    depth: number;

    constructor(data: any | null) {
        if (!data) {
            this.width = 0;
            this.height = 0;
            this.depth = 0;
            return;
        }
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

    constructor(data: any | null) {
        if (!data) {
            this.rating = 0;
            this.comment = '';
            this.date = new Date();
            this.reviewerName = '';
            this.reviewerEmail = '';
            return;
        }
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

    constructor(data: any | null) {
        if (!data) {
            this.createdAt = new Date();
            this.updatedAt = new Date();
            this.barcode = '';
            this.qrCode = '';
            return;
        }
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.barcode = data.barcode;
        this.qrCode = data.qrCode;
    }
}

export class ProductsResponse {
    products: Product[];
    total: number = 0;
    skip: number = 0;
    limit: number = 0;

    constructor(data: any) {
        this.products = data.products.map((product: any) => new Product(product));
        this.total = data.total || 0;
        this.skip = data.skip || 0;
        this.limit = data.limit || 0;
    }
}