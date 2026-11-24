import styles from './SegmentedControl.module.css';

/** Compact single-choice control, e.g. All | ASR | GLSI. */
export default function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className={styles.control}>
      {options.map((option) => (
        <button
          key={option.value || 'all'}
          type="button"
          className={`${styles.segment} ${option.value === value ? styles.active : ''}`}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
