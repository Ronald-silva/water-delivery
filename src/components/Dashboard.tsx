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
  X
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">Água Express</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500">MENU</div>
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 ${
              view === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5" />
            Painel
          </button>
          <button
            onClick={() => setView('orders')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 ${
              view === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Package className="w-5 h-5" />
            Pedidos
          </button>
          <button
            onClick={() => setView('routes')}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 ${
              view === 'routes' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Truck className="w-5 h-5" />
            Rotas
          </button>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500">SISTEMA</div>
          <button
            onClick={() => addToast('Em desenvolvimento', 'info')}
            className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-600"
          >
            <Settings className="w-5 h-5" />
            Configurações
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-600"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </nav>
      </div>
      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-200 ease-in-out`}>
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
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
                <p className="text-sm text-gray-600">
                  {view === 'dashboard' && 'Visão geral do sistema'}
                  {view === 'orders' && 'Gestão de pedidos'}
                  {view === 'routes' && 'Organização das entregas'}
                  {view === 'new-order' && 'Cadastro de novo pedido'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {view !== 'new-order' && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              )}

              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {view !== 'new-order' && (
                <Button
                  icon={Plus}
                  onClick={() => setView('new-order')}
                >
                  Novo Pedido
                </Button>
              )}
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <div className="p-6">
          {view === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

              {/* Performance Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <div className="p-6">
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

                <Card>
                  <div className="p-6">
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
                        <span className="font-semibold text-green-500">{stats.weeklyGrowth}</span>
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

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Latest Orders */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Últimos Pedidos</h3>
                <OrderList 
                  orders={orders.slice(0, 5)}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            </>
          )}
          {/* Orders View */}
          {view === 'orders' && (
            <OrderList 
              orders={orders}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {/* Routes View */}
          {view === 'routes' && (
            <DeliveryRoutes
              routes={routes}
              onUpdateRoute={updateRoute}
              onReorderDeliveries={reorderDeliveries}
            />
          )}

          {/* New Order View */}
          {view === 'new-order' && (
            <NewOrderForm
              onSubmit={handleNewOrder}
              onCancel={() => setView('orders')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;