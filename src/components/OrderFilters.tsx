// src/components/OrderFilters.tsx
import React from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  Calendar, 
  CreditCard,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import Button from './ui/button';
import Card from './ui/card';
import { OrderStatus, PaymentMethod } from '@/types/order';

interface OrderFiltersState {
  search: string;
  status: OrderStatus | 'all';
  dateRange: string;
  paymentMethod: PaymentMethod | 'all';
}

interface OrderFiltersProps {
  filters: OrderFiltersState;
  onFilterChange: (newFilters: Partial<OrderFiltersState>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  isOpen = false,
  onToggle
}) => {
  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.dateRange !== 'all' || 
    filters.paymentMethod !== 'all';

  const statusOptions = [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'CONFIRMED', label: 'Confirmado' },
    { value: 'IN_DELIVERY', label: 'Em Entrega' },
    { value: 'DELIVERED', label: 'Entregue' },
    { value: 'CANCELLED', label: 'Cancelado' }
  ];

  const paymentOptions = [
    { value: 'money', label: 'Dinheiro' },
    { value: 'card', label: 'Cartão' },
    { value: 'pix', label: 'PIX' }
  ];

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa e Toggle */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou endereço..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          onClick={onToggle}
          variant={hasActiveFilters ? 'primary' : 'outline'}
          className="sm:w-auto flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
              {Object.entries(filters)
                .filter(([key, value]) => key !== 'search' && value !== 'all')
                .length}
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Painel de Filtros */}
      {isOpen && (
        <Card className="border border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Filtros</h3>
              {hasActiveFilters && (
                <button
                  onClick={() => onFilterChange({
                    status: 'all',
                    dateRange: 'all',
                    paymentMethod: 'all'
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Status
                  </div>
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange({ status: e.target.value as OrderStatus | 'all' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">Todos</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Período */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Período
                  </div>
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => onFilterChange({ dateRange: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">Todo período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Últimos 7 dias</option>
                  <option value="month">Último mês</option>
                </select>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pagamento
                  </div>
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => onFilterChange({ paymentMethod: e.target.value as PaymentMethod | 'all' })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">Todas as formas</option>
                  {paymentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderFilters;