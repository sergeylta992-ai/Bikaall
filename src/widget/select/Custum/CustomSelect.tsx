// AdvancedCustomSelect.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CustomSelect.scss'

export interface AdvancedSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface AdvancedCustomSelectProps {
  options: AdvancedSelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[], option: AdvancedSelectOption | AdvancedSelectOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const CustomSelect: React.FC<AdvancedCustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите вариант',
  disabled = false,
  multiple = false,
  searchable = true,
  clearable = true,
  className = '',
  label,
  error,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
////
   const [selectedTech, setSelectedTech] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // const techOptions: SelectOption[] = [
  //   { value: 'react', label: 'React', icon: '⚛️' },
  //   { value: 'vue', label: 'Vue.js', icon: '🟢' },
  //   { value: 'angular', label: 'Angular', icon: '🅰️' },
  //   { value: 'svelte', label: 'Svelte', icon: '💫' },
  // ];

  // const cityOptions: SelectOption[] = [
  //   { value: 'moscow', label: 'Москва' },
  //   { value: 'spb', label: 'Санкт-Петербург' },
  //   { value: 'kazan', label: 'Казань' },
  //   { value: 'ekb', label: 'Екатеринбург' },
  // ];

  // const skillOptions: SelectOption[] = [
  //   { value: 'js', label: 'JavaScript' },
  //   { value: 'ts', label: 'TypeScript' },
  //   { value: 'react', label: 'React' },
  //   { value: 'node', label: 'Node.js' },
  //   { value: 'python', label: 'Python' },
  // ];




/////
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !option.disabled
  );

  // Группировка опций
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || 'Без группы';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, AdvancedSelectOption[]>);

  // Обработчики клавиатуры
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, filteredOptions, highlightedIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleOptionClick = (option: AdvancedSelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      const newOptions = options.filter(opt => newValues.includes(opt.value));
      onChange?.(newValues, newOptions);
    } else {
      onChange?.(option.value, option);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '', multiple ? [] : {} as AdvancedSelectOption);
  };

  const removeOption = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    const newOptions = options.filter(opt => newValues.includes(opt.value));
    onChange?.(newValues, newOptions);
  };

  const renderSelectedValue = () => {
    if (selectedOptions.length === 0) {
      return <span className="placeholder">{placeholder}</span>;
    }

    if (multiple) {
      return (
        <div className="selected-tags">
          {selectedOptions.map(option => (
            <span key={option.value} className="selected-tag">
              {option.icon && <span className="tag-icon">{option.icon}</span>}
              {option.label}
              <button
                type="button"
                className="tag-remove"
                onClick={(e) => removeOption(option.value, e)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="selected-option">
        {selectedOptions[0].icon && <span className="option-icon">{selectedOptions[0].icon}</span>}
        <span className="option-text">{selectedOptions[0].label}</span>
      </div>
    );
  };

  return (
    <div className={`advanced-custom-select ${className} ${disabled ? 'disabled' : ''}`} ref={selectRef}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div
        className={`select-trigger ${isOpen ? 'active' : ''} ${error ? 'error' : ''} ${multiple ? 'multiple' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="selected-value">
          {renderSelectedValue()}
        </div>
        
        <div className="select-controls">
          {clearable && selectedOptions.length > 0 && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              ×
            </button>
          )}
          <div className={`select-arrow ${isOpen ? 'rotated' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {error && <div className="select-error">{error}</div>}

      {isOpen && (
        <div className="select-dropdown">
          {searchable && (
            <div className="search-container">
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="options-list">
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="no-options">Ничего не найдено</div>
            ) : (
              Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <div key={groupName} className="option-group">
                  {groupName !== 'Без группы' && (
                    <div className="group-header">{groupName}</div>
                  )}
                  {groupOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={`select-option ${
                        selectedValues.includes(option.value) ? 'selected' : ''
                      } ${option.disabled ? 'disabled' : ''} ${
                        index === highlightedIndex ? 'highlighted' : ''
                      }`}
                      onClick={() => handleOptionClick(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="option-content">
                        {multiple && (
                          <div className="checkbox">
                            <input
                              type="checkbox"
                              checked={selectedValues.includes(option.value)}
                              readOnly
                            />
                          </div>
                        )}
                        {option.icon && <span className="option-icon">{option.icon}</span>}
                        <div className="option-info">
                          <div className="option-label">{option.label}</div>
                          {option.description && (
                            <div className="option-description">{option.description}</div>
                          )}
                        </div>
                      </div>
                      
                      {!multiple && selectedValues.includes(option.value) && (
                        <div className="option-check">✓</div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;