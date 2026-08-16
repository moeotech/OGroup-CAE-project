import { FileText, Send, Eye, CheckCircle, CreditCard } from 'lucide-react';

export type QuoteStatus = 'draft' | 'pending' | 'viewed' | 'accepted' | 'paid';

interface QuoteLifecycleProps {
  status: QuoteStatus;
  className?: string;
}

export default function QuoteLifecycle({ status, className = '' }: QuoteLifecycleProps) {
  const steps = [
    { id: 'draft', label: 'مسودة', icon: FileText },
    { id: 'pending', label: 'مُرسل', icon: Send },
    { id: 'viewed', label: 'شوهد', icon: Eye },
    { id: 'accepted', label: 'مقبول', icon: CheckCircle },
    { id: 'paid', label: 'مدفوع', icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);
  // Default to 0 if not found, though draft is 0 anyway.
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className={`flex items-center w-full max-w-sm ${className}`}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none" title={step.label}>
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
              isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'
            } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
              <Icon className="w-4 h-4" />
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-1 rounded-full transition-all ${
                isActive && index < activeIndex ? 'bg-blue-600' : 'bg-slate-100'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
