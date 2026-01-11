import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './BreakSelect.module.scss';

// Типы для структуры данных
interface BreakItem {
  title: string;
  break: string[];
}

interface BreakCategory {
  title: string;
  break: BreakItem[];
}

interface SelectedItem {
  category: string;
  breakItem: string;
  id: string;
}

interface MobileMultiSelectProps {
  data: BreakCategory[];
  send: (data: SelectedItem[]) => void;
  onSelectionChange?: (selectedItems: SelectedItem[]) => void;
  className?: string;
}

const CustomMultiSelect: React.FC<MobileMultiSelectProps> = ({ 
  data,
  send, 
  onSelectionChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Блокировка скролла при открытом dropdown
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Функция для обновления выбранных элементов
  const updateSelectedItems = useCallback((newSelectedItems: SelectedItem[]) => {
    setSelectedItems(newSelectedItems);
    
    // Всегда вызываем send
    send(newSelectedItems);
    
    // И onSelectionChange если он есть
    if (onSelectionChange) {
      onSelectionChange(newSelectedItems);
    }
  }, [send, onSelectionChange]);

  // Получаем все поломки в плоском виде для поиска
  const allBreakItems = data[0]?.break.flatMap(category => 
    category.break.map(breakItem => ({
      category: category.title,
      breakItem,
      id: `${category.title}-${breakItem}`
    }))
  ) || [];

  // Фильтруем элементы по поисковому запросу
  const filteredItems = allBreakItems.filter(item =>
    item.breakItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Группируем по категориям для отображения
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  // Проверяем, выбран ли элемент
  const isItemSelected = (item: typeof allBreakItems[0]) => {
    return selectedItems.some(selected => 
      selected.category === item.category && selected.breakItem === item.breakItem
    );
  };

  // Переключение выбора элемента
  const toggleItem = (item: typeof allBreakItems[0]) => {
    const isSelected = isItemSelected(item);
    let newSelectedItems: SelectedItem[];

    if (isSelected) {
      newSelectedItems = selectedItems.filter(selected => 
        !(selected.category === item.category && selected.breakItem === item.breakItem)
      );
    } else {
      newSelectedItems = [...selectedItems, { ...item, id: `${item.category}-${item.breakItem}-${Date.now()}` }];
    }
    
    updateSelectedItems(newSelectedItems);
  };

  // Удаление выбранного элемента
  const removeItem = (id: string) => {
    const newSelectedItems = selectedItems.filter(item => item.id !== id);
    updateSelectedItems(newSelectedItems);
  };

  // Очистка всех выбранных элементов
  const clearAll = () => {
    updateSelectedItems([]);
  };

  // Получаем текст для заголовка select
  const getHeaderText = () => {
    if (selectedItems.length === 0) {
      return "Выберите поломки...";
    }
    if (selectedItems.length === 1) {
      return selectedItems[0].breakItem;
    }
    return `Выбрано: ${selectedItems.length} поломок`;
  };

  // ... остальной JSX код остается таким же
  return (
    <div className={`${styles.container} ${className}`}>
      {/* Основной заголовок */}
      <h1 className={styles.mainTitle}>{data[0]?.title || "Выберите поломку"}</h1>

      {/* Кастомный select триггер */}
      <div className={styles.selectWrapper}>
        <div 
          className={`${styles.selectTrigger} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(true)}
        >
          <span className={styles.triggerText}>{getHeaderText()}</span>
          {selectedItems.length > 0 && (
            <span className={styles.selectedCount}>{selectedItems.length}</span>
          )}
          <div className={`${styles.triggerIcon} ${isOpen ? styles.open : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Fullscreen dropdown меню */}
      {isOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          {/* Шапка dropdown */}
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Выберите поломки</span>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Поиск */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Поиск поломок..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          {/* Список элементов */}
          <div className={styles.dropdownContent}>
            {Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className={styles.categorySection}>
                  <div className={styles.categoryHeader}>{category}</div>
                  {items.map((item) => {
                    const selected = isItemSelected(item);
                    return (
                      <div
                        key={`${item.category}-${item.breakItem}`}
                        className={styles.optionItem}
                        onClick={() => toggleItem(item)}
                      >
                        <div className={`${styles.checkbox} ${selected ? styles.checked : ''}`} />
                        <span className={styles.optionText}>{item.breakItem}</span>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <div className={styles.emptyStateText}>
                  {searchTerm ? 'Поломки не найдены' : 'Нет доступных поломок'}
                </div>
              </div>
            )}
          </div>

          {/* Кнопки действий */}
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.actionButton} ${styles.secondaryButton}`}
              onClick={clearAll}
              disabled={selectedItems.length === 0}
            >
              Очистить
            </button>
            <button 
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => setIsOpen(false)}
            >
              Готово
            </button>
          </div>
        </div>
      )}

      {/* Красивый список выбранных элементов */}
      {selectedItems.length > 0 && (
        <div className={styles.selectedList}>
          <h3 className={styles.selectedListTitle}>
            Выбранные поломки
            <span className={styles.selectedCountBadge}>{selectedItems.length}</span>
          </h3>
          <div className={styles.selectedTags}>
            {selectedItems.map((item) => (
              <div key={item.id} className={styles.selectedTag}>
                <div className={styles.tagContent}>
                  <div className={styles.tagCategory}>{item.category}</div>
                  <div className={styles.tagName}>{item.breakItem}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className={styles.removeTagButton}
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Состояние когда ничего не выбрано */}
      {selectedItems.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🔧</div>
          <div className={styles.emptyStateText}>
            Выберите поломки из списка выше
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;
