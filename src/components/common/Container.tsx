export function Container({ children }: { children: React.ReactNode }) {
  return <div className='h-full max-w-[--global-max-width]'>{children}</div>;
}
