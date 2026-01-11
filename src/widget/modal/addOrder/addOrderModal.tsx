import { useEffect, useState } from 'react';
import cls from './addOrderModal.module.scss'
import { collection, addDoc, getDocs, doc, setDoc,serverTimestamp} from 'firebase/firestore';
import { db } from '../../../../config/FireBase/FireBase';
import { useUsers } from '../../../app/provider/UserPropvider/UserPropvider';
import BreakSelect from '../../select/BreakSelect/BreakSelect';


interface MyComponentProps {
  modal: boolean;
  setModal: () => void;
}


const AddOrderModal : React.FC<MyComponentProps> = ({ modal, setModal }) => {



  const [dark,setDark] = useState('')
  const [bike,setBike] = useState([])
  const [breaking, setBreaking] = useState([])
  const [selectedValue, setSelectedValue] = useState('');
  
  const { user } = useUsers()

  useEffect(()=>{
    getBike()
  },[])

const breakSelectdata = [
  { title:"веберите поломку",
    break:[
          { title:"колесо",
            break:
                  ["прокол переднего",
                  "Шатается  переднее колесо,",
                  "прокол заднего колеса",
                  "Посторонние звуки в заднем колесе"
                  ]

          },
            {title:"Тормоза",
              break:[
                      "Не работают передние тормаза",
                      "Не работают задние тормаза",
                      "Сломана ручка тормаза левая",
                      "Сломана ручка тормаза Правая",
                    ]

              }
          ]
  }
]


 const createOrder = async () => {
  console.log(user[0]?.dark)

    const breaks = breaking.map((data)=>data.breakItem) 

     try {
       const docRef = await addDoc(collection(db, "orders"), {

      

         // ... другие данные заявки ...
         bike:bike[0].name,
         dark: user[0]?.dark,
         kurator: user[0]?.name,
         // Записываем дату создания через серверную временную метку
         time: serverTimestamp(),
         breaking:breaks
         // Альтернатива: использовать локальное время
         // createdAt: Timestamp.fromDate(new Date())
       });
       console.log("Заявка создана с ID: ", docRef.id);
     } catch (error) {
       console.error("Ошибка при добавлении заявки: ", error);
     }
   };

  const getBike = async ()=> {
      try {
         const getBike = await getDocs(collection(db,'bikes'))
         const data = getBike.docs.map(doc=>{
           return {
            ...doc.data()
         } 
          })
          console.log("велосипеды",data)
          setBike(data)
         
      } catch (error) {
        console.log('ошибка получение велосипедов')
      }
  }
   

const handleSelectChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    setBreaking(prev=>[...prev,event.target.value])
  };

const setDocOrder = async ()=> {
  try {
    

  } catch (error) {
    
  }
}  
const setBikeNumber = (id: string) => {
  const updatedBike = bike.filter(item => item.name === id);
  setBike(updatedBike);
  console.log(updatedBike);
};

const creatBid = (data:any) => {
 setBreaking(data)
 console.log(breaking)
}

const order = ()=> {
  console.log(breaking.map((data)=>data.breakItem))
}

  return (
    <div className={modal?cls.wrap:cls.none}>
        <div className={cls.modal}>
          <h1>Велосипед</h1>
          <div className={cls.wrapNumber}>
          {bike.map(data=>(
            <div className={cls.number} onClick={()=>setBikeNumber(data.name)}>{data.name}</div>
          ))}
          </div> 
          <label htmlFor="grouped-select"></label>
       
          <button onClick={()=>setModal()}>X</button>
          
         {bike.length===1 && <div>
          <BreakSelect 
          data={breakSelectdata}
          send={creatBid}
          />
          
          <button onClick={createOrder}>создать</button>
          <button onClick={order}>поломки</button>

          <input type="text" name="" id=""  placeholder='коментарий'/>
          </div>}
        </div>
        
    </div>
  );
};

export default AddOrderModal;