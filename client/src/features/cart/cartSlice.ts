import { createSlice, createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";
import { cartService,type Cart,type CartItem } from "../../services/api";


interface CartState {
    items: CartItem[];
    isOpen: boolean;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: CartState = {
    items: [],
    isOpen: false,
    status: 'idle',
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart', async () => {
        return await cartService.getCart();
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart', async ({ productId, quantity }: { productId: number, quantity: number }) => {
      await cartService.addToCart(productId, quantity);
      return await cartService.getCart();
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart', async (itemId: number) => {
        await cartService.removeItem(itemId);
        return itemId;
    }
);

export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity', async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
        await cartService.updateQuantity(itemId, quantity);
        return await cartService.getCart();
    }
);


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
    
        openCart: (state) => {
            state.isOpen = true;
        },
    
        closeCart: (state) => {
            state.isOpen = false;
        },

        clearLocalCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
         .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.items = action.payload.items;
            state.status = 'idle';
         })
         .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.items = action.payload.items;
    })

        .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        })

        .addCase(updateItemQuantity.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.items = action.payload.items;
        });
    },
});

export const { toggleCart, openCart, closeCart, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
        




    