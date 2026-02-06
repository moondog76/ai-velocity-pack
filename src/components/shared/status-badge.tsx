import { cn } from '@/lib/utils';

const statusConfig = {
  NOT_STARTED: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: 'Not Started',
  },
  DRAFT: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    label: 'Draft',
  },
  SUBMITTED: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    label: 'Submitted',
  },
  GRADED: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Graded',
  },
};

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}
