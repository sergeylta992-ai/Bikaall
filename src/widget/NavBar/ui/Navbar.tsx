import { Link } from 'react-router-dom';
import cls from './Navbar.module.scss';
import Thembtn from '../../../components/thembtn/ThemBtn';
import { classNames } from '../../../shared/lib/classNames/classNames';
import { useTheme } from '../../../components/thembtn/useTheme';
import AppLink from '../../../shared/ui/AppLink/AppLink';
import ModalUser from '../../modal/user/ModalUser';
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, setDoc,serverTimestamp} from 'firebase/firestore';
import { db } from '../../../../config/FireBase/FireBase';
import { useUsers } from '../../../app/provider/UserPropvider/UserPropvider';
import Cookies from 'js-cookie';

const Navbar = () => {


 

  const [Nuser,setNUser ] = useState('')
  const { user, setUser } = useUsers()
  const [modalUser,setModalUser]= useState(false)

   useEffect(()=>{
    fetchUsers()
  },[user])
  
  
  const { theme } = useTheme();

  const fetchUsers = async  ()=> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data = querySnapshot.docs.map(doc=>doc.data())
      const username = Cookies.get('username');
      const userFire = data.find(item => item.name === username);
      
      console.log(userFire.role)
      // if (username) {
      //     setNUser(username)
      // } else {
      //   setNUser(user[0]?.role)
      // }
    

    } catch (error) {
        console.log(error)
    }
}
   const close =()=> {
    setModalUser(prev=>!prev)
   }
   const userOut = () => {
        Cookies.remove('username');
        //setUser("username")
   }
if (Nuser==="admin") {
  return (
    <div className={classNames("", {}, [theme,cls.wrap])}>
        <AppLink to={"parts"}>Запчасти</AppLink>
        <AppLink to={"main"}>Заявки М</AppLink>
   </div>
  )
} else {

  return (
    <div className={classNames("", {}, [theme,cls.wrap])}>
      <ModalUser 
        open={modalUser}
        close={close}   
      />
      {Nuser==="сергей" && <AppLink to={"parts"}>Запчасти</AppLink>}
      <AppLink to={"/about"}>About</AppLink>
      
      
      <AppLink to={"/bikes"}>Заявки ВВ</AppLink>
      <button onClick={close}>войти</button>
      <button onClick={userOut}>выйти</button>
      <Thembtn/>
   </div>
  );
  }
};

export default Navbar;