import React from 'react';
import { formatCurrency } from '@/utils/format';

interface PrintOrderProps {
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
  };
  type: 'order' | 'receipt';
}

const PrintOrder: React.FC<PrintOrderProps> = ({ order, type }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Não mostrar na tela, apenas para impressão
  return (
    <div className="hidden print:block p-8">
      {/* Cabeçalho */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">Água Express</h1>
        <p className="text-sm text-gray-600">Sistema de Gestão de Entregas</p>
        <p className="text-sm text-gray-600">Tel: (XX) XXXX-XXXX</p>
      </div>

      {/* Tipo do Documento */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">
          {type === 'order' ? 'Pedido de Entrega' : 'Comprovante de Entrega'}
        </h2>
        <p className="text-sm text-gray-600">
          {`Data: ${currentDate} - Hora: ${currentTime}`}
        </p>
      </div>

      {/* Informações do Pedido */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Dados do Pedido</h3>
        <div className="space-y-1">
          <p>Pedido Nº: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Data: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Dados do Cliente</h3>
        <div className="space-y-1">
          <p>Nome: {order.customerName}</p>
          <p>Telefone: {order.phone}</p>
          <p>Endereço: {order.address}</p>
        </div>
      </div>

      {/* Detalhes do Pedido */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Detalhes do Pedido</h3>
        <div className="space-y-1">
          <p>Quantidade: {order.items} garrafões</p>
          <p>Forma de Pagamento: {order.paymentMethod}</p>
          <p>Total: {formatCurrency(order.total)}</p>
          {order.notes && <p>Observações: {order.notes}</p>}
        </div>
      </div>

      {/* Assinaturas (apenas para comprovante) */}
      {type === 'receipt' && (
        <div className="mt-12">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="border-t border-black w-48 pt-2">
                <p>Assinatura do Entregador</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black w-48 pt-2">
                <p>Assinatura do Cliente</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>Documento gerado em {currentDate} às {currentTime}</p>
        {type === 'receipt' && <p>Este documento é um comprovante de entrega</p>}
      </div>
    </div>
  );
};

export default PrintOrder;