import { Order } from "src/app/models/order/order";
import { OrderItem } from "src/app/models/order/order-item/order-item";

export function getError(orderItem: OrderItem, order: Order) {
  if (orderItem.itemAmount <= 0)
    return 'Insira a quantidade do produto';

  if (!orderItem.product.id)
    return 'Selecione um produto';

  if (!order.status?.description)
    return 'Defina o status do pedido';

  if (!orderItem.itemStatus?.description)
    return 'Defina o status do produto';

  if (!order.customer?.id)
    return 'Selecione um cliente';

  return null;
}
