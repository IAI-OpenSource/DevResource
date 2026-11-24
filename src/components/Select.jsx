import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export default function Select({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <select
          id={id}
          className={styles.select}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  );
}
