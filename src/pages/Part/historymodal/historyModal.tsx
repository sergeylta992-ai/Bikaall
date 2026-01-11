import { useEffect } from 'react';
import cls from './historyModal.module.scss'

const HistoryModal = (props:any) => {

  const { part,parthistory } = props


  return (
    <div>
        <h1>История передвижения</h1>
        {parthistory.map((part:any)=>(
          <div>
            <h1>{}</h1>
            <span>{part?.bike}</span>
            <span>{part?.dark}</span>
            <span>{part?.quantity}</span>
          </div>
        ))}
    </div>
  );
};

export default HistoryModal;