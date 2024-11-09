import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  User,
  Phone,
  ArrowUpDown,
  Package,
  DollarSign
} from 'lucide-react';
import Card from './ui/card';
import Button from './ui/button';
import { formatCurrency } from '@/utils/format';

interface DeliveryOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: number;
  total: number;
  estimatedTime?: string;
  sequence?: number;
}

interface DeliveryRoute {
  id: string;
  name: string;
  orders: DeliveryOrder[];
  status: 'pending' | 'in_progress' | 'completed';
  deliveryMan?: string;
  estimatedDuration?: string;
}

interface DeliveryRoutesProps {
  routes: DeliveryRoute[];
  onUpdateRoute: (routeId: string, updates: Partial<DeliveryRoute>) => void;
  onReorderDeliveries: (routeId: string, orderId: string, newIndex: number) => void;
}

const DeliveryRoutes: React.FC<DeliveryRoutesProps> = ({
  routes,
  onUpdateRoute,
  onReorderDeliveries
}) => {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [draggingOrder, setDraggingOrder] = useState<string | null>(null);

  const handleDragStart = (orderId: string) => {
    setDraggingOrder(orderId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (routeId: string, index: number) => {
    if (draggingOrder) {
      onReorderDeliveries(routeId, draggingOrder, index);
      setDraggingOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Rotas de Entrega</h2>
        <Button icon={Truck}>Nova Rota</Button>
      </div>

      {routes.map(route => (
        <Card key={route.id}>
          <div className="p-4">
            {/* Cabeçalho da Rota */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{route.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  {route.deliveryMan && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{route.deliveryMan}</span>
                    </div>
                  )}
                  {route.estimatedDuration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{route.estimatedDuration}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <select
                  value={route.status}
                  onChange={(e) => onUpdateRoute(route.id, { status: e.target.value as DeliveryRoute['status'] })}
                  className="p-2 border rounded-lg"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
            </div>

            {/* Lista de Entregas */}
            <div className="space-y-2">
              {route.orders.map((order, index) => (
                <div
                  key={order.id}
                  draggable
                  onDragStart={() => handleDragStart(order.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(route.id, index)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-move"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Sequência */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Informações do Cliente */}
                    <div className="md:col-span-2">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {order.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {order.address}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes do Pedido */}
                    <div className="flex items-center justify-end gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{order.items} garrafões</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                      {order.estimatedTime && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{order.estimatedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DeliveryRoutes;