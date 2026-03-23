interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rush-green via-rush-forest to-rush-teal text-white py-16 md:py-24">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed animate-fade-in-up [animation-delay:150ms] opacity-0">
          {description}
        </p>
      </div>
    </div>
  );
}
