import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProfileDATA } from 'user/user.dto';
import { AuthGuard } from 'auth/auth.guard';
import { OrderDto } from './dto/order.dto';
import { RoleGuard } from 'auth/role.guard.guard';
import { RequireRole } from 'common/common.decorator';
interface AuthenticatedRequest extends Request {
  user: ProfileDATA;
}

@ApiTags('Orders')
@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @RequireRole('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Return all orders successfully.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 502, description: 'Bad Gateway.' })
  async getDataOrders() {
    return this.orderService.getDataOrders();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @RequireRole('superadmin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the order details.',
    type: CreateOrderDto,
  })
  @ApiResponse({ status: 400, description: 'Order not found or invalid ID.' })
  @ApiResponse({ status: 502, description: 'Bad Gateway.' })
  async getDetailOrders(@Param('id') orderId: string) {
    return this.orderService.getDetailOrders(orderId);
  }

  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @RequireRole('superadmin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 502, description: 'Bad Gateway.' })
  async createOrders(
    @Req() req: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrders(req.user, createOrderDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @RequireRole('superadmin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID to update' })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 502, description: 'Bad Gateway.' })
  async updateOrders(
    @Req() req: AuthenticatedRequest,
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrders(req.user, updateOrderDto, orderId);
  }
}
