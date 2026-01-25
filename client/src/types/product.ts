export interface Category {
    id: number;
    name: string;
    description?: string;
}


export interface Product {
    id: number;
    name: string;
    title?: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
    category?: Category;
    categoryId?: number;
}