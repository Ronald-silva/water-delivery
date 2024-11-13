// src/components/OrderList.tsx
import React, { useState } from 'react';
import { 
  Package, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign,
  Check,
  Truck,
  X,
  AlertCircle,
  Printer,
  Eye
} from 'lucide-react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import OrderFilters from './OrderFilters';
import PrintOrder from './PrintOrder';
import OrderDetails from './OrderDetails';
import { useModal } from '@/hooks/useModal';
import { usePrint } from '@/hooks/usePrint';
import { Order, OrderStatus, PaymentMethod } from '@/types/order';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

interface OrderFiltersState {
  search: string;
  status: OrderStatus | 'all';
  dateRange: string;
  paymentMethod: PaymentMethod | 'all';
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus }) => {
  // Hooks
  const { print } = usePrint();
  const cancelModal = useModal();
  const confirmModal = useModal();
  const deliveryModal = useModal();

  // Estados
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<OrderFiltersState>({
    search: '',
    status: 'all',
    dateRange: 'all',
    paymentMethod: 'all'
  });

  // Handlers
  const handleFilterChange = (newFilters: Partial<OrderFiltersState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    cancelModal.openModal();
  };

  const handleStartDelivery = (orderId: string) => {
    setSelectedOrderId(orderId);
    confirmModal.openModal();
  };

  const handleConfirmDelivery = (orderId: string) => {
    setSelectedOrderId(orderId);
    deliveryModal.openModal();
  };

  const handlePrint = (order: Order, type: 'order' | 'receipt') => {
    print(<PrintOrder order={order} type={type} />);
  };

  // Filtragem de pedidos
  const filteredOrders = orders.filter(order => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = !filters.search || 
      order.customerName.toLowerCase().includes(searchTerm) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm);

    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesPayment = filters.paymentMethod === 'all' || order.paymentMethod === filters.paymentMethod;

    const orderDate = new Date(order.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesDate = (() => {
      if (filters.dateRange === 'all') return true;
      if (filters.dateRange === 'today') {
        return orderDate >= today;
      }
      if (filters.dateRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      }
      if (filters.dateRange === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orderDate >= monthAgo;
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  // Estado vazio
  if (filteredOrders.length === 0) {
    return (
      <>
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          isOpen={filterPanelOpen}
          onToggle={() => setFilterPanelOpen(prev => !prev)}
        />
        <Card>
          <div className="p-6 text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
            {(filters.search || filters.status !== 'all' || 
              filters.dateRange !== 'all' || filters.paymentMethod !== 'all') && (
              <Button
                variant="outline"
                onClick={() => setFilters({
                  search: '',
                  status: 'all',
                  dateRange: 'all',
                  paymentMethod: 'all'
                })}
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        isOpen={filterPanelOpen}
        onToggle={() => setFilterPanelOpen(prev => !prev)}
      />

      <Card>
        <div className="p-6">
          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:bg-gray-50">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Informações do Cliente */}
                    <div className="md:col-span-2">
                      <h3 className="font-medium">{order.customerName}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {order.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {order.address}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'IN_DELIVERY' ? 'bg-purple-100 text-purple-800' : ''}
                        ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {order.status === 'PENDING' && 'Pendente'}
                        {order.status === 'CONFIRMED' && 'Confirmado'}
                        {order.status === 'IN_DELIVERY' && 'Em Entrega'}
                        {order.status === 'DELIVERED' && 'Entregue'}
                        {order.status === 'CANCELLED' && 'Cancelado'}
                      </span>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Detalhes</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrint(order, 'order')}
                      >
                        <Printer className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Imprimir</span>
                      </Button>

                      {order.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <X className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Cancelar</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
                          >
                            <Check className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Confirmar</span>
                          </Button>
                        </>
                      )}

                      {order.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartDelivery(order.id)}
                        >
                          <Truck className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Iniciar Entrega</span>
                        </Button>
                      )}

                      {order.status === 'IN_DELIVERY' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(order, 'receipt')}
                          >
                            <Printer className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Comprovante</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleConfirmDelivery(order.id)}
                          >
                            <Check className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Confirmar Entrega</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Modais */}
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={cancelModal.closeModal}
        onConfirm={() => {
          onUpdateStatus(selectedOrderId, 'CANCELLED');
          cancelModal.closeModal();
        }}
        title="Cancelar Pedido"
        description="Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita."
        type="danger"
        confirmText="Sim, Cancelar"
        cancelText="Não, Manter"
      />

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        onConfirm={() => {
          onUpdateStatus(selectedOrderId, 'IN_DELIVERY');
          confirmModal.closeModal();
        }}
        title="Iniciar Entrega"
        description="Confirma que o pedido está saindo para entrega?"
        type="warning"
        confirmText="Sim, Iniciar Entrega"
        cancelText="Não, Aguardar"
      />

      <Modal
        isOpen={deliveryModal.isOpen}
        onClose={deliveryModal.closeModal}
        onConfirm={() => {
          onUpdateStatus(selectedOrderId, 'DELIVERED');
          deliveryModal.closeModal();
        }}
        title="Confirmar Entrega"
        description="Confirma que o pedido foi entregue com sucesso?"
        type="success"
        confirmText="Sim, Foi Entregue"
        cancelText="Não, Ainda Não"
      />

      {/* Modal de Detalhes do Pedido */}
      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </>
  );
};

export default OrderList;