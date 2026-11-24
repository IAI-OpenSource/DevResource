import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.css';

const SearchInput = forwardRef(function SearchInput({ value, onChange, placeholder }, ref) {
  return (
    <div className={styles.wrapper}>
      <Search size={18} className={styles.icon} aria-hidden="true" />
      <input
        ref={ref}
        type="search"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck="false"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) onChange('');
        }}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => {
            onChange('');
            ref?.current?.focus();
          }}
          aria-label="Clear search"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

export default SearchInput;
