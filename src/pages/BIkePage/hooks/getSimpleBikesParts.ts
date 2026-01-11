
import { collection, addDoc, getDocs, doc, setDoc, query, where} from 'firebase/firestore';
import { db } from '../../../../config/FireBase/FireBase';
// import { db } from '../../../config/FireBase/FireBase';


interface PartData {
  id: string;
  name: string;
  count: number;
  price?: number;        // цена за единицу
  category?: string;
  description?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

interface HistoryEntry {
  id: string;
  bike: string;
  quantity: number;      // количество использованных
  timestamp: any;
  dark?: string;
  [key: string]: any;
}

interface BikePartResult {
  part: PartData;               // Полные данные о запчасти
  history: HistoryEntry[];      // Все записи истории для этого велосипеда
  totalUsed: number;            // Общее количество использованных
  totalCost?: number;           // Общая стоимость использованных (цена × количество)
  lastUsed?: any;               // Дата последнего использования
  usageCount: number;           // Сколько раз использовалась
}

interface BikePartsSummary {
  bikeNumber: string;
  parts: BikePartResult[];      // Все запчасти
  summary: {
    totalParts: number;         // Количество типов запчастей
    totalQuantity: number;      // Общее количество использованных единиц
    totalCost: number;          // Общая стоимость потраченных запчастей
    mostExpensivePart?: {       // Самая дорогая использованная запчасть
      name: string;
      cost: number;
      quantity: number;
    };
    mostUsedPart?: {            // Самая часто используемая запчасть
      name: string;
      quantity: number;
      usageCount: number;
    };
  };
}

export const getSimpleBikeParts = async (bikeNumber: string): Promise<BikePartsSummary> => {
  console.log('=== ПОИСК ЗАПЧАСТЕЙ ДЛЯ ВЕЛОСИПЕДА ===');
  console.log('Ищем велосипед:', bikeNumber);
  
  const allParts = await getDocs(collection(db, 'parts'));
  console.log('Всего запчастей в базе:', allParts.size);
  
  const partsResults: BikePartResult[] = [];
  let totalCost = 0;
  let totalQuantity = 0;
  
  // Для статистики
  let mostExpensive: { name: string; cost: number; quantity: number } | null = null;
  let mostUsed: { name: string; quantity: number; usageCount: number } | null = null;
  
  // Обрабатываем каждую запчасть
  for (const partDoc of allParts.docs) {
    const partId = partDoc.id;
    const partData = partDoc.data();
    
    try {
      // Получаем историю для этой запчасти и этого велосипеда
      const historyRef = collection(db, 'parts', partId, 'history');
      const historyQuery = query(historyRef, where('bike', '==', bikeNumber));
      const querySnapshot = await getDocs(historyQuery);
      
      if (!querySnapshot.empty) {
        // Собираем все записи истории
        const historyEntries: HistoryEntry[] = [];
        let partTotalUsed = 0;
        let lastUsed: any = null;
        
        querySnapshot.forEach(doc => {
          const historyData = doc.data();
          const historyEntry: HistoryEntry = {
            id: doc.id,
            bike: historyData.bike,
            quantity: historyData.quantity || 0,
            timestamp: historyData.timestamp,
            dark: historyData.dark,
            ...historyData
          };
          
          historyEntries.push(historyEntry);
          partTotalUsed += historyEntry.quantity;
          
          // Находим последнее использование
          if (!lastUsed || (historyData.timestamp?.seconds > lastUsed.seconds)) {
            lastUsed = historyData.timestamp;
          }
        });
        
        // Сортируем историю по дате (новые сверху)
        historyEntries.sort((a, b) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeB - timeA;
        });
        
        // Рассчитываем стоимость использованных
        const partPrice = partData.price || 0;
        const partTotalCost = partTotalUsed * partPrice;
        
        // Добавляем к общей статистике
        totalCost += partTotalCost;
        totalQuantity += partTotalUsed;
        
        // Обновляем самую дорогую запчасть
        if (!mostExpensive || partTotalCost > mostExpensive.cost) {
          mostExpensive = {
            name: partData.name || partId,
            cost: partTotalCost,
            quantity: partTotalUsed
          };
        }
        
        // Обновляем самую часто используемую запчасть
        if (!mostUsed || partTotalUsed > mostUsed.quantity) {
          mostUsed = {
            name: partData.name || partId,
            quantity: partTotalUsed,
            usageCount: historyEntries.length
          };
        }
        
        // Создаем объект результата для этой запчасти
        const result: BikePartResult = {
          part: {
            id: partId,
            name: partData.name || 'Без названия',
            count: partData.count || 0,
            price: partPrice,
            category: partData.category,
            description: partData.description,
            createdAt: partData.createdAt,
            updatedAt: partData.updatedAt,
            ...partData
          },
          history: historyEntries,
          totalUsed: partTotalUsed,
          totalCost: partTotalCost,
          lastUsed: lastUsed,
          usageCount: historyEntries.length
        };
        
        partsResults.push(result);
      }
      
    } catch (error) {
      console.error(`Ошибка при обработке запчасти ${partId}:`, error);
    }
  }
  
  // Сортируем результаты по стоимости (от дорогих к дешевым)
  partsResults.sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0));
  
  // Формируем итоговый объект
  const summary: BikePartsSummary = {
    bikeNumber,
    parts: partsResults,
    summary: {
      totalParts: partsResults.length,
      totalQuantity,
      totalCost,
      mostExpensivePart: mostExpensive || undefined,
      mostUsedPart: mostUsed || undefined
    }
  };
  
  console.log('\n=== ИТОГОВАЯ СТАТИСТИКА ===');
  console.log(`Запчастей использовано: ${summary.summary.totalParts} видов`);
  console.log(`Общее количество: ${summary.summary.totalQuantity} шт.`);
  console.log(`Общая стоимость: ${summary.summary.totalCost} руб.`);
  
  if (summary.summary.mostExpensivePart) {
    console.log(`Самая дорогая запчасть: ${summary.summary.mostExpensivePart.name}`);
    console.log(`  Стоимость: ${summary.summary.mostExpensivePart.cost} руб.`);
  }
  
  if (summary.summary.mostUsedPart) {
    console.log(`Самая частая запчасть: ${summary.summary.mostUsedPart.name}`);
    console.log(`  Использовано: ${summary.summary.mostUsedPart.quantity} шт.`);
  }
  
  return summary;
};