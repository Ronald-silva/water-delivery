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

// Types
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED';
type PaymentMethod = 'money' | 'card' | 'pix';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  total: number;
  notes?: string;
}

interface OrderFiltersState {
  search: string;
  status: string;
  dateRange: 'today' | 'week' | 'month' | 'all';
  paymentMethod: string;
}

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
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
  const [filters, setFilters] = useState<OrderFiltersState>({
    search: '',
    status: 'all',
    dateRange: 'all',
    paymentMethod: 'all'
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Funções auxiliares
  const formatDate = (date: string) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleTimeString();
    } catch {
      return '';
    }
  };

  const getPaymentMethodText = (method: PaymentMethod) => {
    const methods = {
      money: 'Dinheiro',
      card: 'Cartão',
      pix: 'PIX'
    };
    return methods[method];
  };

  // Handlers
  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    cancelModal.openModal();
  };

  const handleConfirmDelivery = (orderId: string) => {
    setSelectedOrderId(orderId);
    deliveryModal.openModal();
  };

  const handleStartDelivery = (orderId: string) => {
    setSelectedOrderId(orderId);
    confirmModal.openModal();
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

    const matchesPayment = filters.paymentMethod === 'all' || 
      order.paymentMethod === filters.paymentMethod;

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

  // Componente de Status Badge
  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', text: 'Confirmado' },
      IN_DELIVERY: { color: 'bg-purple-100 text-purple-800', text: 'Em Entrega' },
      DELIVERED: { color: 'bg-green-100 text-green-800', text: 'Entregue' },
      CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Estado vazio
  if (!filteredOrders.length) {
    return (
      <>
        <OrderFilters
          filters={filters}
          onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
          onClearFilters={() => setFilters({
            search: '',
            status: 'all',
            dateRange: 'all',
            paymentMethod: 'all'
          })}
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
      {/* Filtros */}
      <OrderFilters
        filters={filters}
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        onClearFilters={() => setFilters({
          search: '',
          status: 'all',
          dateRange: 'all',
          paymentMethod: 'all'
        })}
        isOpen={filterPanelOpen}
        onToggle={() => setFilterPanelOpen(prev => !prev)}
      />

      {/* Lista de Pedidos */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pedidos</h2>
            <span className="text-sm text-gray-500">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:bg-gray-50 transition-colors">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">{order.customerName}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Phone className="w-4 h-4" />
                        <span>{order.phone}</span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{order.address}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <StatusBadge status={order.status} />
                      {order.createdAt && (
                        <span className="text-gray-600">
                          {formatDate(order.createdAt)}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-4 pt-4 mt-2 border-t">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Package className="w-4 h-4" />
                            <span>{order.items} garrafões</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>R$ {order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{getPaymentMethodText(order.paymentMethod)}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={Eye}
                            onClick={() => setSelectedOrder(order)}
                          >
                            Detalhes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            icon={Printer}
                            onClick={() => handlePrint(order, 'order')}
                          >
                            Imprimir
                          </Button>
                          {order.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                icon={X}
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                icon={Check}
                                onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
                              >
                                Confirmar
                              </Button>
                            </>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              icon={Truck}
                              onClick={() => handleStartDelivery(order.id)}
                            >
                              Iniciar Entrega
                            </Button>
                          )}
                          {order.status === 'IN_DELIVERY' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                icon={Printer}
                                onClick={() => handlePrint(order, 'receipt')}
                              >
                                Comprovante
                              </Button>
                              <Button
                                size="sm"
                                icon={Check}
                                onClick={() => handleConfirmDelivery(order.id)}
                              >
                                Confirmar Entrega
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Modais de Confirmação */}
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
