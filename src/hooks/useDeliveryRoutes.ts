import { useState } from 'react';

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

export const useDeliveryRoutes = () => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);

  const addRoute = (route: Omit<DeliveryRoute, 'id'>) => {
    const newRoute = {
      ...route,
      id: Date.now().toString()
    };
    setRoutes(prev => [...prev, newRoute]);
  };

  const updateRoute = (routeId: string, updates: Partial<DeliveryRoute>) => {
    setRoutes(prev => 
      prev.map(route => 
        route.id === routeId ? { ...route, ...updates } : route
      )
    );
  };

  const reorderDeliveries = (routeId: string, orderId: string, newIndex: number) => {
    setRoutes(prev => 
      prev.map(route => {
        if (route.id !== routeId) return route;
        const orders = [...route.orders];
        const oldIndex = orders.findIndex(o => o.id === orderId);
        const [order] = orders.splice(oldIndex, 1);
        orders.splice(newIndex, 0, order);
        return { ...route, orders };
      })
    );
  };

  return {
    routes,
    addRoute,
    updateRoute,
    reorderDeliveries
  };
};