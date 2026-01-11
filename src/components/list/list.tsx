import React, { useState, useMemo, useRef, useEffect } from 'react';

interface AutocompleteSelectProps {
  items?: string[];
  placeholder?: string;
  noResultsText?: string;
}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  items = [],
  placeholder = "Начните вводить...",
  noResultsText = "Совпадений не найдено"
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Фильтруем элементы по введенному тексту
  const filteredItems = useMemo(() => {
    if (!inputValue.trim()) return items;
    
    return items.filter(item =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [items, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
    setIsOpen(true);
    setSelectedValue('');
  };

  const handleItemSelect = (item: string): void => {
    setInputValue(item);
    setSelectedValue(item);
    setIsOpen(false);
  };

  const handleInputFocus = (): void => {
    setIsOpen(true);
  };

  // Закрываем dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Функция для подсветки совпадающего текста
  const highlightMatch = (text: string, query: string): JSX.Element => {
    if (!query) return <span>{text}</span>;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <span>{text}</span>;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <span>
        {before}
        <span style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
          {match}
        </span>
        {after}
      </span>
    );
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '300px', margin: '20px' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />

      {isOpen && inputValue && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemSelect(item)}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  backgroundColor: selectedValue === item ? '#f0f0f0' : 'white',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.backgroundColor = selectedValue === item ? '#f0f0f0' : 'white';
                }}
              >
                {highlightMatch(item, inputValue)}
              </div>
            ))
          ) : (
            <div style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>
              {noResultsText}
            </div>
          )}
        </div>
      )}

      {selectedValue && (
        <div style={{ marginTop: '10px' }}>
          <strong>Выбрано:</strong> {selectedValue}
        </div>
      )}
    </div>
  );
};

// Пример использования компонента
const App: React.FC = () => {
  const cities: string[] = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 
    'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 
    'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Владивосток',
    'Пермь', 'Волгоград', 'Воронеж', 'Саратов', 'Краснодар'
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h2>Поиск с автодополнением</h2>
      <AutocompleteSelect 
        items={cities} 
        placeholder="Введите название города..."
        noResultsText="Городов не найдено"
      />
    </div>
  );
};

export default App;