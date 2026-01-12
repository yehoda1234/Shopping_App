import axios from "axios";
import type {Product}  from "../types/product";


const API_URL = 'http://127.0.0.1:3000';

export const api = axios.create({
    baseURL: API_URL,
});


export const productsService = {
    getAll: async () => {
        const response = await api.get<Product[]>("/products");
        return response.data;
    
    },
};