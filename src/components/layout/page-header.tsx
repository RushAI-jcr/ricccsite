interface PageHeaderProps {
  title: string;
  description: string;
  label?: string;
}

export function PageHeader({ title, description, label }: PageHeaderProps) {
  return (
    <header className="pt-32 pb-16 md:pb-24 px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {label && (
          <span className="font-mono text-xs uppercase tracking-widest text-rush-teal mb-4 block">
            {label}
          </span>
        )}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-rush-dark-green leading-[1.1] mb-6">
          {title}
        </h1>
        <p className="text-xl text-rush-on-surface-variant max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
    </header>
  );
}
