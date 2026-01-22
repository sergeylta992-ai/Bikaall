import styles from './SelectParts.module.scss';

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface SelectParts {
  id: string;
  count: number;
  quantity?: number; // Количество которое выбрал пользователь
}

interface FilterCheckboxProps {
  open:boolean;
  title: string;
  options: FilterOption[];
  selected: SelectParts[];
  onChange: (selected: SelectParts[]) => void;
}

const SelectParts = ({ open, title, options, selected, onChange }: FilterCheckboxProps) => {
  
  // Получаем массив только ID для удобства проверки
  const selectedIds = selected.map(item => item.id);
  
  const handleSelect = (id: string) => {
    const isSelected = selectedIds.includes(id);
    
    if (isSelected) {
      // Удаляем если уже выбран
      const newSelected = selected.filter(item => item.id !== id);
      onChange(newSelected);
    } else {
      // Находим опцию чтобы получить доступное количество
      const option = options.find(opt => opt.id === id);
      if (option) {
        // Добавляем новый объект с количеством по умолчанию 1
        const newItem: SelectParts = {
          id: option.id,
          count: option.count,
          quantity: 1
        };
        const newSelected = [...selected, newItem];
        onChange(newSelected);
      }
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const newSelected = selected.map(item => {
      if (item.id === id) {
        const currentQuantity = item.quantity || 1;
        const newQuantity = Math.max(1, Math.min(item.count, currentQuantity + delta));
        
        return {
          ...item,
          quantity: newQuantity
        };
      }
      return item;
    });
    
    onChange(newSelected);
  };

  const save = () => {
    console.log('Выбранные детали:', selected);
    // Здесь можно добавить логику сохранения
  };

  return (
    <div className={`${ open ? styles.filterGroup : styles.none }`}>
      <div className={styles.filterTitle}>
        <span>{title}</span>
        {selected.length > 0 && (
          <span className={styles.selectedCount}>
            Выбрано: {selected.length}
          </span>
        )}
      </div>
      
      {options.map(option => {
        const isSelected = selectedIds.includes(option.id);
        const selectedItem = selected.find(item => item.id === option.id);
        
        return (
          <div key={option.id} className={`${styles.filterItem} ${isSelected ? styles.selected : ''}`}>
            <label className={styles.filterLabel}>
              <span 
                className={`${styles.filterName} ${isSelected ? styles.checked : ''}`}
                onClick={() => handleSelect(option.id)}
              >
                {option.name}
                <span className={styles.availableCount}>
                  (доступно: {option.count})
                </span>
              </span>
              
              {isSelected && selectedItem && (
                <div className={styles.quantityControls}>
                  <button 
                    className={styles.quantityBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(option.id, -1);
                    }}
                    disabled={(selectedItem.quantity || 1) <= 1}
                  >
                    -
                  </button>
                  <span className={styles.quantityValue}>
                    {selectedItem.quantity || 1}
                  </span>
                  <button 
                    className={styles.quantityBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(option.id, 1);
                    }}
                    disabled={(selectedItem.quantity || 1) >= option.count}
                  >
                    +
                  </button>
                </div>
              )}
            </label>
          </div>
        );
      })}
      
      <button 
        className={styles.saveButton}
        onClick={save}
        disabled={selected.length === 0}
      >
        Сохранить ({selected.length})
      </button>
      
      {/* Отладка */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className={styles.debugInfo}>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default SelectParts;