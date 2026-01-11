import cls from './AppOrder.module.scss'
import { useEffect, useState, Ref, useRef } from 'react';
import { collection, getDocs, doc,query,deleteDoc ,where } from 'firebase/firestore';
import { db } from '../../../config/FireBase/FireBase';
import Loader from '../../components/loader/loader';
import AddOrderModal from "../../widget/modal/addOrder/addOrderModal"
import Set from '../../img/set.svg'
import Del from '../../img/del2.svg'
import { timeOrder } from '../../shared/lib/timeOrder/timeStamp';
import { Navbar } from '../../widget/NavBar';
import { useUsers } from '../../app/provider/UserPropvider/UserPropvider';

const AppOrders = () => {

  console.log("render")
const { user, setUser } = useUsers()
const [dark,setDark] = useState('')
const [order,setOrder] = useState([])
const [Loading,setLoading]= useState(false)
const [bikes,setBikes] = useState([])
const [OrderModal,setOrderModal] = useState(false)

useEffect( () => {
  getOrders()
},[user])

const deleletOrder = async (data:string)=>{
      try {
        const docRef = doc(db,'orders',data)
        await deleteDoc(docRef)
        console.log('order delete')
      } catch(error) {
        console.log(error)
      }
}


const createOrder = () => {
   setOrderModal(prev=>!prev)
  };
const getOrders = async () => {
      setLoading(true)
      setDark(user[0]?.dark)


      try {

          const usersCollectionRef = collection(db, 'orders');
        const dark = user[0]?.dark
        console.log(user)
      // 2. Создаем запрос с фильтром по полю "status"
          const q = query(usersCollectionRef, where('dark', '==',dark));

        
          const querySnapshot = await getDocs(q);
      



          const data = querySnapshot.docs.map(doc=>{
           return {
             id:doc.id,
            ...doc.data()
           } 
          })
          setOrder(data)
          setLoading(false)
          console.log(data)
        } catch (error) {
          console.error('❌ Ошибка:', error);
        } finally {
          setLoading(false)
        }
    } 

  return (
    <div>
      <Loader load={Loading}/>
      <AddOrderModal
      modal={OrderModal}
      setModal={createOrder}
      />
      <h1>Заявки</h1>
      <h2>{user[0]?.dark}</h2>
      <button onClick ={createOrder}>создать заявку</button>
      <button onClick ={getOrders}>обновить</button>
      
                {order.map((data,index)=>(
                  <div key={data.id} className={cls.wrap}>
                     
                     <div>{data.bikes}</div>
                     <div>{timeOrder(data.time)}</div>
                     <div className={cls.del}><Del onClick={()=>deleletOrder(data.id)}width={24}/></div>
                     {data.breaking.map((data:string)=>(
                      <div>{data}</div>
                     ))}
                </div>

                ))}
    
    </div>
  );
};

export default AppOrders;