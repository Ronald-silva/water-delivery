// src/components/DeliveryRoutes.tsx
import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  User,
  Phone,
  Package,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Plus,
  GripVertical
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
  onCreateRoute?: () => void;
}

interface DeliveryCardProps {
  order: DeliveryOrder;
  index: number;
  routeId: string;
  isDragging: boolean;
  isDragOver: boolean;
}

const DeliveryRoutes: React.FC<DeliveryRoutesProps> = ({
  routes,
  onUpdateRoute,
  onReorderDeliveries,
  onCreateRoute
}) => {
  // Estados
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);
  const [draggingOrder, setDraggingOrder] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [currentDragRoute, setCurrentDragRoute] = useState<string | null>(null);

  // Handlers de drag and drop
  const handleDragStart = (orderId: string, routeId: string) => {
    setDraggingOrder(orderId);
    setCurrentDragRoute(routeId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingOrder(null);
    setDragOverIndex(null);
    setCurrentDragRoute(null);
  };

  const handleDrop = (routeId: string, index: number) => {
    if (draggingOrder) {
      onReorderDeliveries(routeId, draggingOrder, index);
      handleDragEnd();
    }
  };

  // Suporte para touch em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent, orderId: string, routeId: string) => {
    setTouchStartY(e.touches[0].clientY);
    setDraggingOrder(orderId);
    setCurrentDragRoute(routeId);
  };

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    if (touchStartY !== null) {
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;

      if (Math.abs(deltaY) > 10) {
        setDragOverIndex(index);
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = (routeId: string, index: number) => {
    if (draggingOrder && touchStartY !== null) {
      onReorderDeliveries(routeId, draggingOrder, index);
    }
    setTouchStartY(null);
    handleDragEnd();
  };

  // Toggle de expansão das rotas
  const toggleRouteExpansion = (routeId: string) => {
    setExpandedRoutes(prev =>
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const isRouteExpanded = (routeId: string) => expandedRoutes.includes(routeId);

  // Componente de Card de Entrega
  const DeliveryCard: React.FC<DeliveryCardProps> = ({ 
    order, 
    index, 
    routeId,
    isDragging,
    isDragOver 
  }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(order.id, routeId)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragEnd={handleDragEnd}
      onDrop={() => handleDrop(routeId, index)}
      onTouchStart={(e) => handleTouchStart(e, order.id, routeId)}
      onTouchMove={(e) => handleTouchMove(e, index)}
      onTouchEnd={() => handleTouchEnd(routeId, index)}
      className={`
        p-4 bg-white rounded-lg border shadow-sm
        ${isDragging ? 'opacity-50' : ''}
        ${isDragOver ? 'border-blue-500' : ''}
        transform transition-transform
        ${isDragOver ? 'scale-105' : 'scale-100'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
          {index + 1}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{order.customerName}</h4>
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              {order.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {order.address}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 pt-2 border-t">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              {order.items} garrafões
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(order.total)}
            </div>
          </div>
        </div>
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Rotas de Entrega
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Organize e acompanhe as entregas do dia
          </p>
        </div>
        <Button
          onClick={onCreateRoute}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Rota
        </Button>
      </div>

      {/* Lista de Rotas */}
      <div className="space-y-4">
        {routes.map((route) => (
          <Card key={route.id}>
            {/* Cabeçalho da Rota */}
            <div className="p-4 sm:p-6 border-b">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleRouteExpansion(route.id)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isRouteExpanded(route.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <h3 className="font-medium text-lg">{route.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {route.deliveryMan && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{route.deliveryMan}</span>
                          </div>
                        )}
                        {route.estimatedDuration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{route.estimatedDuration}</span>
                          </div>
                        )}
                        <span className={`
                          px-2 py-1 rounded-full text-sm
                          ${route.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${route.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                          ${route.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        `}>
                          {route.status === 'pending' && 'Pendente'}
                          {route.status === 'in_progress' && 'Em Andamento'}
                          {route.status === 'completed' && 'Concluída'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <select
                  value={route.status}
                  onChange={(e) => onUpdateRoute(route.id, { 
                    status: e.target.value as DeliveryRoute['status'] 
                  })}
                  className="w-full sm:w-auto p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
            </div>

            {/* Lista de Entregas */}
            {isRouteExpanded(route.id) && (
              <div className="p-4 space-y-3">
                {route.orders.map((order, index) => (
                  <div key={order.id}>
                    {/* Versão Mobile */}
                    <div className="lg:hidden">
                      <DeliveryCard
                        order={order}
                        index={index}
                        routeId={route.id}
                        isDragging={draggingOrder === order.id}
                        isDragOver={dragOverIndex === index}
                      />
                    </div>

                    {/* Versão Desktop */}
                    <div className="hidden lg:block">
                      <div 
                        className={`
                          p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move
                          ${draggingOrder === order.id ? 'opacity-50' : ''}
                          ${dragOverIndex === index ? 'border-2 border-blue-500' : ''}
                        `}
                        draggable
                        onDragStart={() => handleDragStart(order.id, route.id)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={() => handleDrop(route.id, index)}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 flex justify-center">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                          </div>
                          <div className="col-span-4">
                            <h4 className="font-medium">{order.customerName}</h4>
                            <div className="text-sm text-gray-600">{order.phone}</div>
                          </div>
                          <div className="col-span-4 text-sm text-gray-600">
                            {order.address}
                          </div>
                          <div className="col-span-2 text-sm text-gray-600">
                            {order.items} garrafões
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {route.orders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma entrega adicionada a esta rota
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {routes.length === 0 && (
        <Card>
          <div className="p-6 text-center">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma rota criada
            </h3>
            <p className="text-gray-600 mb-4">
              Crie uma nova rota para começar a organizar suas entregas
            </p>
            <Button onClick={onCreateRoute}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Nova Rota
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DeliveryRoutes;