export interface Product {
    id: number;
    name: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    stock: number;
    categoryId?: number;
}