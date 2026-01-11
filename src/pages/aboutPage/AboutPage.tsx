import { useUsers } from '../../app/provider/UserPropvider/UserPropvider';
import cls from './AboutPage.module.scss'
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, setDoc,serverTimestamp} from 'firebase/firestore';
import Cookies from "js-cookie"
import { db } from '../../../config/FireBase/FireBase';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  
  const { user, setUser } = useUsers()

   useEffect(()=>{
    const userCook = Cookies.get('username')
    console.log(user)
      if (user[0]?.role==="куратор") {
          navigate('/orders')
      }
      if (user[0]?.role==="master") {
          navigate('/master')
      }

},[user])

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
           navigate('/orders')
            console.log(user)
        }
        
      } catch (error) {
        console.log("ошибка")
      }
  }


  
  return (
    <div className={open?cls.wrap:cls.none}>
        <div className={cls.modal}>
          <h2>login</h2>
          <input type="text" onChange={(e)=>setLogin(e.target.value)} value={login}/>
          <h2>Password</h2>
          <input type="text" onChange={(e)=>setPassword(e.target.value)} value={password}/>
          <button onClick={setUsers}>войти</button>
          </div>      
    </div>
  );
};

export default AboutPage;