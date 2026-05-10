
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 relative overflow-hidden group">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 max-w-sm mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 mb-8 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-10 h-10 text-primary-600" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}