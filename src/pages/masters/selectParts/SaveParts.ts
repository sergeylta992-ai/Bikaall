import { 
  doc, 
  updateDoc, 
  increment, 
  writeBatch, 
  collection, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../../config/FireBase/FireBase';

interface bike {
  bike:string,
  dark:string,
}

interface documentIds {
  id:string,
  quantity:number,
}


interface UpdateFieldParams {
  collectionName: string;
  documentIds: documentIds[];
  fieldName: string;
  operation: 'increment' | 'decrement' | 'set';
  value?: number;
  //amount?: number;
  // Новые параметры для подколлекции
  subcollectionName?: string;    // Имя подколлекции
  subcollectionData?: bike;// Данные для добавления в подколлекцию
  addTimestamp?: boolean;        // Добавлять timestamp в данные подколлекции
}

/**
 * Обновляет числовое поле в нескольких документах Firestore
 * и добавляет запись в подколлекцию
 */
export const updateNumericField = async ({
  collectionName,
  documentIds,
  fieldName,
  operation,
  value,
  //amount = 1,
  subcollectionName,
  subcollectionData,
  addTimestamp = true
}: UpdateFieldParams): Promise<{ 
  success: boolean; 
  message: string;
  updatedDocuments: string[];
  addedToSubcollection: string[];
}> => {
  try {
    if (!documentIds || documentIds.length === 0) {
      return { 
        success: false, 
        message: 'No document IDs provided',
        updatedDocuments: [],
        addedToSubcollection: []
      };
    }

    const batch = writeBatch(db);
    const updatedDocuments: string[] = [];
    const addedToSubcollection: string[] = [];

    // Обрабатываем каждый документ
    for (const docId of documentIds) {
      const docRef = doc(db, collectionName, docId.id);
      
      // Обновляем основное поле
      switch (operation) {
        case 'increment':
          batch.update(docRef, {
            [fieldName]: increment(docId.quantity),
            updatedAt: serverTimestamp()
          });
          break;
          
        case 'decrement':
          batch.update(docRef, {
            [fieldName]: increment(-docId.quantity),
            updatedAt: serverTimestamp()
          });
          break;
          
        case 'set':
          if (value === undefined) {
            throw new Error('Value is required for "set" operation');
          }
          batch.update(docRef, {
            [fieldName]: value,
            updatedAt: serverTimestamp()
          });
          break;
          
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      
      updatedDocuments.push(docId.id);

      // Добавляем в подколлекцию если указано
      if (subcollectionName && subcollectionData) {
        const subcollectionRef = collection(db, collectionName, docId.id, subcollectionName);
        const newDocRef = doc(subcollectionRef); // Создаем ссылку на новый документ
        
        const enhancedData = {
          ...subcollectionData,
          // fieldUpdated: fieldName,
           //operation,
           quantity: docId.quantity,
            // amount: operation === 'set' ? value : quantity,
          timestamp: addTimestamp ? serverTimestamp() : new Date(),
          // parentDocumentId: docId
        };
        
        batch.set(newDocRef, enhancedData);
        addedToSubcollection.push(docId.id);
      }
    }

    await batch.commit();
    
    return {
      success: true,
      message: `Successfully updated ${updatedDocuments.length} document(s)${
        addedToSubcollection.length > 0 
          ? ` and added to ${subcollectionName} subcollection` 
          : ''
      }`,
      updatedDocuments,
      addedToSubcollection
    };
    
  } catch (error) {
    console.error('Error updating documents:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      updatedDocuments: [],
      addedToSubcollection: []
    };
  }
};