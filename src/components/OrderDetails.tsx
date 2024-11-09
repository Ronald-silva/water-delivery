import React from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Package, 
  DollarSign, 
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react';
import Card from './ui/card';
import { formatCurrency, formatDateTime } from '@/utils/format';

interface OrderDetailsProps {
  order: {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    items: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    total: number;
    notes?: string;
    history?: Array<{
      status: string;
      timestamp: string;
      comment?: string;
    }>;
  };
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_DELIVERY: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  };

  const statusText = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    IN_DELIVERY: 'Em Entrega',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado'
  };

  const paymentMethodText = {
    money: 'Dinheiro',
    card: 'Cartão',
    pix: 'PIX'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Detalhes do Pedido #{order.id}</h2>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${statusColors[order.status as keyof typeof statusColors]}`}>
                {statusText[order.status as keyof typeof statusText]}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações do Cliente */}
            <Card>
              <div className="p-4">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-blue-500" />
                  Informações do Cliente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{order.address}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detalhes do Pedido */}
            <Card>
              <div className="p-4">
                <h3 className="font-medium flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-500" />
                  Detalhes do Pedido
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{order.items} garrafões</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{paymentMethodText[order.paymentMethod as keyof typeof paymentMethodText]}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Observações */}
            {order.notes && (
              <Card className="md:col-span-2">
                <div className="p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    Observações
                  </h3>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              </Card>
            )}

            {/* Histórico */}
            {order.history && (
              <Card className="md:col-span-2">
                <div className="p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Histórico
                  </h3>
                  <div className="space-y-4">
                    {order.history.map((entry, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${statusColors[entry.status as keyof typeof statusColors]}`} />
                        <div>
                          <div className="font-medium">
                            {statusText[entry.status as keyof typeof statusText]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDateTime(entry.timestamp)}
                          </div>
                          {entry.comment && (
                            <div className="text-sm text-gray-600 mt-1">
                              {entry.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;