import styles from './Button.module.css';

/**
 * A button that can also render as a link:
 *   <Button>Save</Button>
 *   <Button as={Link} to="/resources">Browse</Button>
 *   <Button as="a" href="https://…">Open</Button>
 */
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) {
  const type = Component === 'button' ? { type: 'button' } : {};
  return (
    <Component
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      {...type}
      {...props}
    >
      {children}
      {icon}
    </Component>
  );
}
