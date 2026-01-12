import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

@Post()
addToCart(@Request() req, @Body() createCartDto: CreateCartDto) {
  return this.cartService.addToCart(req.user, createCartDto);
}

@Get()
getCart(@Request() req) {
  return this.cartService.getCart(req.user);
}

@Delete(':itemId')
removeItem(@Param('itemId') itemId: string) {
  return this.cartService.removeItem(+itemId);
}


@Delete('clear')
clearCart(@Request() req) {
  return this.cartService.clearCart(req.user);
}
}
























































//   @Post()
//   create(@Body() createCartDto: CreateCartDto) {
//     return this.cartService.create(createCartDto);
//   }

//   @Get()
//   findAll() {
//     return this.cartService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.cartService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
//     return this.cartService.update(+id, updateCartDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.cartService.remove(+id);
//   }
// }