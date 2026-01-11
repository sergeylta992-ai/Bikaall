import { useEffect, useState } from 'react';
import { useUsers } from '../../app/provider/UserPropvider/UserPropvider';
import cls from './AppMasters.module.scss'
import Loader from '../../components/loader/loader';
import { collection, addDoc, getDocs, doc, setDoc,serverTimestamp,deleteDoc} from 'firebase/firestore';
import { timeOrder } from '../../shared/lib/timeOrder/timeStamp';
import { db } from '../../../config/FireBase/FireBase';
import Del from '../../img/del2.svg'
import SelectParts from './selectParts/SelectParts';
import {updateNumericField }from "./selectParts/SaveParts"


const AppMasters = () => {

  const [Loading,setLoading]= useState(true)
  const [order,setOrder] = useState([])
  const [selectedParts, setSelectedParts] = useState([]);
  const [Parts, setParts] = useState([]);




  useEffect( () => {
    getOrders()
    getParts()
  },[])

  const getParts = async ()=>{
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'parts'));
      const data = querySnapshot.docs.map(doc=>{
        return {
          id:doc.id,
         ...doc.data()
        } 
       })
       setParts(data)
      console.log(data)

    } catch (error) {
        console.log('ошибка загрузки списка запчпстей')
    }
  }

  const getOrders = async () => {
        setLoading(true)
        try {

            const querySnapshot = await getDocs(collection(db, 'orders'));

            const data = querySnapshot.docs.map(doc=>{
             return {
               id:doc.id,
              ...doc.data()
             } 
            })
            setOrder(data)
            console.log(data)
          } catch (error) {
            console.error('❌ Ошибка:', error);
          } finally {
            setLoading(false)
          }
      } 
  

  const { user, setUser } = useUsers()

  const deleletOrder = async (data:string)=>{


        try {
          const docRef = doc(db,'orders',data)
          await deleteDoc(docRef)
          console.log('order delete')
        } catch(error) {
          console.log(error)
        }
  }


const save = (bike:any)=> {
  console.log(selectedParts) 
  console.log("bike проверка",bike)

    updateNumericField({
      collectionName:"parts",
      documentIds:selectedParts,
      fieldName:"count",
      operation:'decrement',
      subcollectionName:"history",
      subcollectionData:{
        bike:bike.bike,
        dark:bike.dark,
      }
    })



}

  return (
    <div>
      <h1>Master Page</h1>
      <h2>{user[0]?.name}</h2>
      <SelectParts
      title='заgчасти'
      options={Parts}
      selected={selectedParts}
      onChange={setSelectedParts}
     
      />
      <div>
        <h3>Список Заявок</h3>
       
       {order.map((data,index)=>(
                  <div key={data.id} className={cls.wrap}>
                     <div className={cls.orderHeader}>
                      <div className={cls.number}>{data.bike}</div>
                      <div className={cls.time}>{timeOrder(data.time)}</div>
                      <div className={cls.del}><Del onClick={()=>deleletOrder(data.id)}width={24}/></div>
                      </div>
                     {data.breaking.map((data:string)=>(
                      <div>{data}</div>
                     ))}
                     <button className={cls.btnClose} onClick={()=>save(data)}>Закрыть</button>
   
                </div>

                ))}
      </div>
    </div>
  );
};

export default AppMasters;