import React, { useState } from 'react';
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
  Save
} from 'lucide-react';
import { OrderFormData, PaymentMethod } from '@/types/order';
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

  // Watch values for conditional rendering and calculations
  const paymentMethod = watch('paymentMethod');
  const items = watch('items');
  const total = items * WATER_PRICE;

  // Component for form field
  const FormField = ({ 
    label, 
    error, 
    icon: Icon, 
    children,
    required = false 
  }: { 
    label: string;
    error?: string;
    icon: any;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 text-gray-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Novo Pedido</h2>
            <p className="text-sm text-gray-600">Preencha os dados do pedido</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seção: Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-blue-600">
              <User className="w-5 h-5" />
              Informações do Cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-blue-600">
              <Package className="w-5 h-5" />
              Detalhes do Pedido
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Quantidade de Garrafões" 
                error={errors.items?.message}
                icon={Package}
                required
              >
                <input
                  type="number"
                  {...register('items', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
              </FormField>

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

            {paymentMethod === 'money' && (
              <FormField 
                label="Troco para" 
                error={errors.changeAmount?.message}
                icon={DollarSign}
              >
                <input
                  type="number"
                  step="0.01"
                  {...register('changeAmount', { valueAsNumber: true })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </FormField>
            )}

            {/* Total do Pedido */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total do Pedido:</span>
                <span className="text-lg font-bold">{formatCurrency(total)}</span>
              </div>
              {paymentMethod === 'pix' && (
                <p className="text-sm text-gray-600 mt-2">
                  Você receberá as instruções do PIX após confirmar o pedido.
                </p>
              )}
            </div>

            <FormField 
              label="Observações" 
              error={errors.notes?.message}
              icon={FileText}
            >
              <textarea
                {...register('notes')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Instruções especiais para entrega..."
              />
            </FormField>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Criando...' : 'Criar Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default NewOrderForm;