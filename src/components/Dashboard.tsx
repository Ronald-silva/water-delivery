// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import StatCard from '@/components/ui/stat-card';
import QuickAction from '@/components/ui/quick-action';
import OrderList from './OrderList';
import NewOrderForm from './NewOrderForm';
import DeliveryRoutes from './DeliveryRoutes';
import { useDeliveryRoutes } from '@/hooks/useDeliveryRoutes';
import { useToast } from '@/contexts/ToastContext';
import { Order, OrderFormData, OrderStatus } from '@/types/order';
import { formatCurrency } from '@/utils/format';
import { 
  Package, 
  Truck, 
  User, 
  Clock, 
  Plus, 
  DollarSign, 
  Bell,
  Search,
  FileText,
  Calendar,
  CheckCircle,
  TrendingUp,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Phone,
  MapPin
} from 'lucide-react';

type DashboardView = 'dashboard' | 'orders' | 'routes' | 'new-order';

interface DashboardStats {
  pendingOrders: number;
  inDelivery: number;
  revenue: number;
  totalCustomers: number;
  deliveryRate: string;
  avgTime: string;
  satisfaction: string;
  weeklyOrders: number;
  weeklyGrowth: string;
  weeklyRevenue: string;
}
const Dashboard: React.FC = () => {
  // Hooks
  const { addToast } = useToast();
  const { routes, addRoute, updateRoute, reorderDeliveries } = useDeliveryRoutes();

  // Estados
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<DashboardView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [notificationCount, setNotificationCount] = useState(0);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'João Silva',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123',
      items: 2,
      status: 'PENDING',
      paymentMethod: 'money',
      createdAt: '',
      total: 50.00
    }
  ]);

  // Effects
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toISOString());
  }, []);

  useEffect(() => {
    if (currentTime) {
      setOrders(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          createdAt: order.createdAt || currentTime
        }))
      );
    }
  }, [currentTime]);

  // Estatísticas calculadas
  const stats: DashboardStats = {
    pendingOrders: orders.filter(o => o.status === 'PENDING').length,
    inDelivery: orders.filter(o => o.status === 'IN_DELIVERY').length,
    revenue: orders.filter(o => o.status === 'DELIVERED').reduce((acc, curr) => acc + curr.total, 0),
    totalCustomers: new Set(orders.map(o => o.phone)).size,
    deliveryRate: "95%",
    avgTime: "45 min",
    satisfaction: "4.8/5.0",
    weeklyOrders: 324,
    weeklyGrowth: "+12%",
    weeklyRevenue: "8.450"
  };

  // Handlers
  const handleNewOrder = (data: OrderFormData) => {
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      items: data.items,
      status: 'PENDING',
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
      total: data.items * 25.00,
      notes: data.notes
    };

    setOrders(prev => [newOrder, ...prev]);
    setView('orders');
    addToast('Pedido criado com sucesso!', 'success');
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    try {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      const messages = {
        CONFIRMED: 'Pedido confirmado com sucesso!',
        IN_DELIVERY: 'Pedido em rota de entrega!',
        DELIVERED: 'Pedido entregue com sucesso!',
        CANCELLED: 'Pedido cancelado!',
        PENDING: 'Pedido pendente'
      };

      addToast(
        messages[newStatus] || 'Status atualizado com sucesso!', 
        newStatus === 'CANCELLED' ? 'error' : 'success'
      );
    } catch (error) {
      addToast('Erro ao atualizar status do pedido', 'error');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      addToast(`Buscando por: ${term}`, 'info');
    }
  };

  const handleLogout = () => {
    addToast('Logout realizado com sucesso!', 'success');
    // Implementar lógica de logout
  };
  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative lg:flex inset-y-0 left-0 w-64 bg-white border-r shadow-sm transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-30`}
      >
        <div className="flex flex-col h-full">
          {/* Logo e Título */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-600">Água Express</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <button
                onClick={() => setView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  view === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                Painel
              </button>

              <button
                onClick={() => setView('orders')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  view === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                Pedidos
              </button>

              <button
                onClick={() => setView('routes')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  view === 'routes' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Truck className="w-5 h-5" />
                Rotas
              </button>
            </div>

            <div className="mt-6 pt-6 border-t space-y-1">
              <button
                onClick={() => addToast('Em desenvolvimento', 'info')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Settings className="w-5 h-5" />
                Configurações
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-xl font-semibold">
                  {view === 'dashboard' && 'Painel'}
                  {view === 'orders' && 'Pedidos'}
                  {view === 'routes' && 'Rotas de Entrega'}
                  {view === 'new-order' && 'Novo Pedido'}
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {view === 'dashboard' && 'Visão geral do sistema'}
                  {view === 'orders' && 'Gerenciar pedidos'}
                  {view === 'routes' && 'Organizar entregas'}
                  {view === 'new-order' && 'Cadastrar novo pedido'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Busca - Desktop */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {view !== 'new-order' && (
                <Button
                  onClick={() => setView('new-order')}
                  className="hidden sm:flex"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Pedido
                </Button>
              )}
            </div>
          </div>

          {/* Busca - Mobile */}
          <div className="p-4 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </header>
        {/* Área de Conteúdo com Padding Responsivo */}
        <div className="p-4 lg:p-6 overflow-auto">
          {/* Dashboard View */}
          {view === 'dashboard' && (
            <>
              {/* Stats Cards - Grid Responsivo */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <StatCard 
                  title="Pedidos Pendentes" 
                  value={stats.pendingOrders.toString()}
                  icon={Package}
                  trend={{ value: '15%', isUp: true }}
                  color="blue"
                />
                <StatCard 
                  title="Em Entrega" 
                  value={stats.inDelivery.toString()}
                  icon={Truck}
                  color="purple"
                />
                <StatCard 
                  title="Faturamento" 
                  value={formatCurrency(stats.revenue)}
                  icon={DollarSign}
                  trend={{ value: '8%', isUp: true }}
                  color="green"
                />
                <StatCard 
                  title="Clientes" 
                  value={stats.totalCustomers.toString()}
                  icon={User}
                  color="yellow"
                />
              </div>

              {/* Cards de Performance - Layout Responsivo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                {/* Desempenho de Hoje */}
                <Card>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Desempenho de Hoje</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Tempo Médio de Entrega</span>
                        </div>
                        <span className="font-semibold">{stats.avgTime}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Taxa de Entrega</span>
                        </div>
                        <span className="font-semibold">{stats.deliveryRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Satisfação dos Clientes</span>
                        </div>
                        <span className="font-semibold">{stats.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Resumo Semanal */}
                <Card>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Resumo Semanal</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Total de Pedidos</span>
                        </div>
                        <span className="font-semibold">{stats.weeklyOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Crescimento</span>
                        </div>
                        <span className="font-semibold text-green-600">{stats.weeklyGrowth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Receita Total</span>
                        </div>
                        <span className="font-semibold">R$ {stats.weeklyRevenue}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Ações Rápidas */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <QuickAction
                    icon={Plus}
                    title="Novo Pedido"
                    description="Registre um novo pedido"
                    onClick={() => setView('new-order')}
                  />
                  <QuickAction
                    icon={Truck}
                    title="Criar Rota"
                    description="Organize as entregas do dia"
                    onClick={() => setView('routes')}
                  />
                  <QuickAction
                    icon={FileText}
                    title="Relatório"
                    description="Visualize o desempenho"
                    onClick={() => addToast('Relatórios em desenvolvimento', 'info')}
                  />
                </div>
              </div>
              {/* Lista de Pedidos Recentes - Versão Responsiva */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Últimos Pedidos</h3>
                  <Button
                    onClick={() => setView('orders')}
                    variant="ghost"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Ver todos
                  </Button>
                </div>

                {/* Versão Mobile - Cards */}
                <div className="space-y-4 lg:hidden">
                  {orders.slice(0, 5).map((order) => (
                    <Card key={order.id}>
                      <div className="p-4">
                        {/* Cabeçalho do Card */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{order.customerName}</h4>
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {order.phone}
                              </span>
                              <span className="text-sm text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {order.address}
                              </span>
                            </div>
                          </div>
                          <span className={`
                            px-2 py-1 rounded-full text-xs
                            ${order.status === 'PENDING' && 'bg-yellow-100 text-yellow-800'}
                            ${order.status === 'CONFIRMED' && 'bg-blue-100 text-blue-800'}
                            ${order.status === 'IN_DELIVERY' && 'bg-purple-100 text-purple-800'}
                            ${order.status === 'DELIVERED' && 'bg-green-100 text-green-800'}
                            ${order.status === 'CANCELLED' && 'bg-red-100 text-red-800'}
                          `}>
                            {order.status === 'PENDING' && 'Pendente'}
                            {order.status === 'CONFIRMED' && 'Confirmado'}
                            {order.status === 'IN_DELIVERY' && 'Em Entrega'}
                            {order.status === 'DELIVERED' && 'Entregue'}
                            {order.status === 'CANCELLED' && 'Cancelado'}
                          </span>
                        </div>

                        {/* Detalhes do Pedido */}
                        <div className="flex justify-between items-center text-sm pt-3 border-t">
                          <span className="text-gray-600">
                            {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>{order.items} garrafões</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Versão Desktop - Tabela */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <OrderList 
                      orders={orders.slice(0, 5)}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Outras Views */}
          {view === 'orders' && (
            <OrderList 
              orders={orders}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {view === 'routes' && (
            <DeliveryRoutes
              routes={routes}
              onUpdateRoute={updateRoute}
              onReorderDeliveries={reorderDeliveries}
            />
          )}

          {view === 'new-order' && (
            <NewOrderForm
              onSubmit={handleNewOrder}
              onCancel={() => setView('orders')}
            />
          )}
        </div>

        {/* Botão Flutuante Novo Pedido (Mobile) */}
        {view !== 'new-order' && (
          <div className="fixed right-4 bottom-4 sm:hidden">
            <Button
              onClick={() => setView('new-order')}
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;