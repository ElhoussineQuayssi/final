const ScrollReveal = ({ children, delay = 0, className = "" }) => (
  <div
    className={`scroll-reveal ${className}`}
    style={{ animationDelay: `${delay}s`, opacity: 0 }}
  >
    {children}
  </div>
);

export default ScrollReveal;
