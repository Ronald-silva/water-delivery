import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Card from './card';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue'
}) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      trend: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      trend: 'text-purple-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      trend: 'text-yellow-600'
    }
  };

  const colorClasses = colors[color];

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
            <Icon className={`w-6 h-6 ${colorClasses.text}`} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isUp ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{trend.value}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </Card>
  );
};

export default StatCard;