import React from 'react';
import { Filter, Search, X } from 'lucide-react';
import Card from './ui/card';
import Button from './ui/button';

interface OrderFilters {
  search: string;
  status: string;
  dateRange: 'today' | 'week' | 'month' | 'all';
  paymentMethod: string;
}

interface OrderFiltersProps {
  filters: OrderFilters;
  onFilterChange: (filters: Partial<OrderFilters>) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle
}) => {
  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Última Semana' },
    { value: 'month', label: 'Último Mês' },
    { value: 'all', label: 'Todos' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'PENDING', label: 'Pendentes' },
    { value: 'CONFIRMED', label: 'Confirmados' },
    { value: 'IN_DELIVERY', label: 'Em Entrega' },
    { value: 'DELIVERED', label: 'Entregues' },
    { value: 'CANCELLED', label: 'Cancelados' }
  ];

  const paymentOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'money', label: 'Dinheiro' },
    { value: 'card', label: 'Cartão' },
    { value: 'pix', label: 'PIX' }
  ];

  return (
    <div className="mb-6">
      {/* Barra de Pesquisa */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Buscar por nome, telefone ou endereço..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {isOpen ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>

        {(filters.status !== 'all' || filters.dateRange !== 'all' || filters.paymentMethod !== 'all' || filters.search) && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Painel de Filtros */}
      {isOpen && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFilterChange({ 
                  dateRange: e.target.value as OrderFilters['dateRange'] 
                })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Forma de Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => onFilterChange({ paymentMethod: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {paymentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderFilters;