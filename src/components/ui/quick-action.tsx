import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon: Icon,
  title,
  description,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 truncate">{description}</p>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
};

export default QuickAction;