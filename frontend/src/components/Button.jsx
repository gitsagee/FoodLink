
// Components
export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'font-medium rounded transition-colors focus:outline-none focus:ring-2';
  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
