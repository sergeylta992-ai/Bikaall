import { useState } from 'react';
import { doc, updateDoc,addDoc,collection } from 'firebase/firestore';
import cls from './AddPartModal.module.scss';
import { db } from '../../../../config/FireBase/FireBase';


const AddPartModal = (props:any) => {

  const { modal, close, part, getpart} = props

  console.log(part)

  const [name,setname] = useState('')
  const [prise,setprise] = useState(0)
  const [count,setcount] = useState(0)
  const [parts,setParts] = useState([])

  const save = async ()=> {
    
    const data = {
      name:name,
      prise:prise,
      count:count
    }


    try {
      await addDoc(collection(db,'parts','history'),data);
      console.log('Документ успешно обновлен!');
      close()
      
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
      
    } finally {
      getpart()
      console.log("finalyy");
    }


    
  }


  const test = async () => {

    const data = {
      action: 'updated',
      timestamp: new Date(),
      dark:"одинцово",
      bike:"АМО1Р"
    }

    try {
      await addDoc(collection(db,'parts',part[0].id,'history'),data);
      console.log('Документ успешно обновлен!');
      close()
      
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
      
    } finally {
      getpart()
      console.log("finalyy");
    }
  }

  return (
    <div className={modal?cls.wrap:cls.close}>
      <div className={cls.modal}>
        <div className={cls.modalName}>
        <div>Название</div>
              <input 
                  type="text" name="name" id="1" 
                  placeholder={'название'} 
                  onChange={(e)=>setname(e.target.value)}
                />
         </div>       
         <div>Цена закупки</div>
         <input type="number" 
                name="prise" 
                id="2" 
                placeholder={'цена закупки'} 
                onChange={(e)=>setprise(Number(e.target.value))}/>
         <div>Количество</div>
         <input 
         type="number" 
         name="count" 
         id="" 
         placeholder={'Количество'} 
         onChange={(e)=>setcount(Number(e.target.value))}/>
         <button onClick={()=>save()}>сохранить</button>
         <button onClick={()=>test()}>теst</button>
         <button onClick={close}>закрыть</button>
      </div>   
    </div>
  );
};

export default AddPartModal;