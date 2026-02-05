import axios from "axios";
import type { Product } from "../types/product";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = "אירעה שגיאה בלתי צפויה";
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            if (data && data.message) {
                errorMessage = Array.isArray(data.message) ? data.message[0] : data.message;
            }
            switch (status) {
                case 400: toast.error(errorMessage); break;
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(error);
                case 403: toast.error("אין לך הרשאה לבצע פעולה זו ⛔"); break;
                case 404: toast.error("המשאב המבוקש לא נמצא 🔍"); break;
                case 500: toast.error("שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר 🔧"); break;
                default: toast.error(errorMessage);
            }
        } else if (error.request) {
            toast.error("שגיאת תקשורת. אנא בדוק את החיבור לאינטרנט 🌐");
        } else {
            toast.error(error.message);
        }
        return Promise.reject(error);
    }
);

export const productsService = {
    getAll: async () => {
        const response = await api.get<Product[]>("/products");
        return response.data;
    },

    getTrash: async () => {
        const response = await api.get<Product[]>("/products/trash");
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        await api.delete(`/products/${id}`);
        return id;
    },

    restoreProduct: async (id: number) => {
        const response = await api.post(`/products/${id}/restore`);
        return response.data;
    },

    updateProduct: async (id: number, productData: Partial<Product> | FormData) => {
        const response = await api.patch<Product>(`/products/${id}`, productData);
        return response.data;
    },

    createProduct: async (productData: FormData) => {
        const response = await api.post("/products", productData);
        return response.data;
    }
};


export const authService = {
    register: async (email: string, password: string, firstName: string, lastName: string) => {
        const response = await api.post("/users", { email, password, firstName, lastName});
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get("/users/profile");
        return response.data;
    },
};

export interface CartItem {
    id: number;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: number;
    items: CartItem[];
}

export const cartService = {
    getCart: async () => {
        const response = await api.get<Cart>("/cart");
        return response.data;
    },
    addToCart: async (productId: number, quantity: number) => {
        const response = await api.post("/cart", { productId, quantity });
        return response.data;
    },
    removeItem: async (itemId: number) => {
        await api.delete(`/cart/${itemId}`);
        return itemId;
    },
    updateQuantity: async (itemId: number, quantity: number) => {
        const response = await api.patch('/cart/item', { itemId, quantity });
        return response.data;
    },
    clearCart: async () => {
        await api.delete("/cart");
    },
};

export const ordersService = {
    createOrder: async (shippingAddress: string, phone: string, comment?: string) => {
        const response = await api.post("/orders", { shippingAddress, phone, comment });
        return response.data;
    },
    getMyOrders: async () => {
        const response = await api.get("/orders");
        return response.data;
    },
    getAllOrders: async () => {
        const response = await api.get("/orders/all");
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    }
};

export const categoriesService = {
    getAll: async () => {
        const response = await api.get("/categories");
        return response.data;
    },
    create: async (name: string) => {
        const response = await api.post("/categories", { name });
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`/categories/${id}`);
        return id;
    }
};