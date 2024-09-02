
export function Container ({ children }: { children: React.ReactNode }) {
  return (
    <div className='max-w-[--global-max-width] h-full'>
      {children}
    </div>
  );
};