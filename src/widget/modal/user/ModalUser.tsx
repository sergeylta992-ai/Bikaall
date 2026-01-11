import { useState } from 'react';
import cls from './ModalUser.module.scss'
import { collection, addDoc, getDocs, doc, setDoc,serverTimestamp} from 'firebase/firestore';
import { db } from '../../../../config/FireBase/FireBase';
import { useUsers } from '../../../app/provider/UserPropvider/UserPropvider';
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';


const ModalUser = (props:any) => {

const { open ,close }= props 

const { user, setUser } = useUsers()

const[login,setLogin]= useState('')
const[password,setPassword]=useState('')

const navigate = useNavigate();


const setUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data = querySnapshot.docs.map(doc=>doc.data())
      const user = data.find(item => item.name === login);
      Cookies.set('username', user.name, { 
      expires: 7, // срок жизни в днях
      path: '/',
      // secure: true, // только для HTTPS
      // sameSite: 'strict'
    });
      if (user) {
          
         setUser([user])
        navigate('/bikes')
      }
      
    } catch (error) {
      console.log("ошибка")
    }
}
  


  return (
    <div className={open?cls.wrap:cls.none}>
        <div className={cls.modal}>
          <button onClick={close}>х</button>
          <h2>login</h2>
          <input type="text" onChange={(e)=>setLogin(e.target.value)} value={login}/>
          <h2>Password</h2>
          <input type="text" onChange={(e)=>setPassword(e.target.value)} value={password}/>
          <button onClick={setUsers}>войти</button>
          </div>      
    </div>
  );
};

export default ModalUser;