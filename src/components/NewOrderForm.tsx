// src/components/NewOrderForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputMask from 'react-input-mask';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { 
  User, 
  Phone, 
  MapPin, 
  Package,
  DollarSign,
  FileText,
  X,
  AlertCircle,
  Save,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '@/utils/format';

// Schema de validação
const orderSchema = z.object({
  customerName: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  phone: z.string()
    .min(14, 'Telefone inválido')
    .max(15, 'Telefone inválido')
    .regex(/^\([1-9]{2}\) 9[0-9]{4}-[0-9]{4}$/, 'Formato inválido'),
  address: z.string()
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(200, 'Endereço muito longo'),
  items: z.number()
    .min(1, 'Quantidade mínima é 1')
    .max(50, 'Quantidade máxima é 50'),
  paymentMethod: z.enum(['money', 'card', 'pix'] as const),
  changeAmount: z.number().optional(),
  notes: z.string().optional()
});

type OrderFormData = z.infer<typeof orderSchema>;

interface NewOrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  initialData?: Partial<OrderFormData>;
}

// Preço unitário do garrafão
const WATER_PRICE = 25.00;
const NewOrderForm: React.FC<NewOrderFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  // Form hook
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      items: initialData?.items || 1,
      paymentMethod: initialData?.paymentMethod || 'money',
      notes: initialData?.notes || '',
      changeAmount: initialData?.changeAmount || 0
    }
  });

  // Watch values para cálculos e renderização condicional
  const paymentMethod = watch('paymentMethod');
  const items = watch('items');
  const total = items * WATER_PRICE;

  // Componente de campo de formulário reutilizável
  const FormField = ({ 
    label, 
    error, 
    icon: Icon, 
    children,
    required = false,
    className = ''
  }: { 
    label: string;
    error?: string;
    icon: any;
    children: React.ReactNode;
    required?: boolean;
    className?: string;
  }) => (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 text-gray-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  // Handler para adicionar/subtrair quantidade
  const handleQuantityChange = (increment: boolean) => {
    const currentValue = watch('items');
    const newValue = increment ? currentValue + 1 : currentValue - 1;
    
    if (newValue >= 1 && newValue <= 50) {
      setValue('items', newValue, { shouldValidate: true });
    }
  };

  // Handler de envio do formulário
  const onFormSubmit = handleSubmit((data) => {
    if (data.paymentMethod !== 'money') {
      delete data.changeAmount;
    }
    onSubmit(data);
  });

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-4 sm:p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Novo Pedido
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Preencha os dados para criar um novo pedido
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onCancel}
            className="hidden sm:flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="sm:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={onFormSubmit} className="space-y-6">
          {/* Seção: Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-blue-600 mb-4">
              <User className="w-5 h-5" />
              Informações do Cliente
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField 
                label="Nome do Cliente" 
                error={errors.customerName?.message}
                icon={User}
                required
              >
                <input
                  {...register('customerName')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome completo"
                />
              </FormField>

              <FormField 
                label="Telefone" 
                error={errors.phone?.message}
                icon={Phone}
                required
              >
                <InputMask
                  mask="(99) 99999-9999"
                  {...register('phone')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </FormField>
            </div>

            <FormField 
              label="Endereço" 
              error={errors.address?.message}
              icon={MapPin}
              required
            >
              <input
                {...register('address')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rua, número, bairro"
              />
            </FormField>
          </div>

          {/* Seção: Detalhes do Pedido */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-medium flex items-center gap-2 text-blue-600 mb-4">
              <Package className="w-5 h-5" />
              Detalhes do Pedido
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quantidade com botões + e - */}
              <FormField 
                label="Quantidade de Garrafões" 
                error={errors.items?.message}
                icon={Package}
                required
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(false)}
                    className="p-2 border rounded-l-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    {...register('items', { valueAsNumber: true })}
                    className="w-full p-2 border-y text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="50"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(true)}
                    className="p-2 border rounded-r-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </FormField>
              {/* Forma de Pagamento */}
              <FormField 
                label="Forma de Pagamento" 
                error={errors.paymentMethod?.message}
                icon={DollarSign}
                required
              >
                <select
                  {...register('paymentMethod')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="money">Dinheiro</option>
                  <option value="card">Cartão</option>
                  <option value="pix">PIX</option>
                </select>
              </FormField>
            </div>

            {/* Campo de Troco - Aparece apenas quando pagamento é em dinheiro */}
            {paymentMethod === 'money' && (
              <FormField 
                label="Troco para" 
                error={errors.changeAmount?.message}
                icon={DollarSign}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    {...register('changeAmount', { valueAsNumber: true })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </FormField>
            )}

            {/* Informações do PIX */}
            {paymentMethod === 'pix' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  Você receberá as instruções do PIX após confirmar o pedido.
                </p>
              </div>
            )}

            {/* Total do Pedido */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Total do Pedido:</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{formatCurrency(total)}</span>
                  <p className="text-sm text-gray-600">
                    {items} {items === 1 ? 'garrafão' : 'garrafões'} x R$ {WATER_PRICE.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Observações */}
            <FormField 
              label="Observações" 
              error={errors.notes?.message}
              icon={FileText}
              className="mt-4"
            >
              <textarea
                {...register('notes')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Instruções especiais para entrega..."
              />
            </FormField>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto sm:ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar Pedido
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default NewOrderForm;