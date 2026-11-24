import styles from './ChipGroup.module.css';

/**
 * Single-choice filter. Exactly one option is active at a time.
 * `options`: [{ value, label, count? }]. The option with value "" means "All".
 */
export default function ChipGroup({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className={styles.group}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value || 'all'}
            type="button"
            className={`${styles.chip} ${active ? styles.active : ''}`}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {option.count !== undefined && <span className={styles.count}>{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
