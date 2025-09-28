export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);
