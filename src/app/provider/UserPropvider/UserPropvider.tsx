import { FC, useMemo, useState, useEffect,createContext, useContext} from "react";
import { collection, addDoc, getDocs, doc, setDoc,serverTimestamp} from 'firebase/firestore';
import { db } from "../../../../config/FireBase/FireBase";
import Cookies from "js-cookie";


interface Autuser {
  id?: string;
  name?: string;
  email?: string;
  dark?:string;
  password?:string;
  role?:string;
  // добавьте другие поля которые есть в вашей базе данных
}

interface UsersContextType {
  user: Autuser[]; // массив пользователей
  setUser: React.Dispatch<React.SetStateAction<Autuser[]>>;
}


const UsersContext = createContext<UsersContextType | undefined>(undefined);

const UserProvider:FC = ({children}) => {
 
const [ user, setUser ] = useState([])

  const getUser = async () => {
    const username = Cookies.get('username');
    if (!username) {
      const NoUser = {name:"NoUser"}
      setUser([NoUser])
    }
    

    try {
   
      const querySnapshot = await getDocs(collection(db, 'users'));
      const user = querySnapshot.docs.filter(doc => doc.data().name === username);
      
        if(user){
      const users = user.map(doc=>{
           return {
            ...doc.data()
           } 
            
          })
          setUser(users)
        }
      
        
        } catch (error) {
          console.log(error)
        }
      }     

useEffect(()=>{
  getUser()
},[])
  
  


const defaultProps = useMemo(() => {
  return { user, setUser };
}, [user, setUser]);

  return (
<UsersContext.Provider value={defaultProps}>
  {children}
</UsersContext.Provider>
  );
};

export default UserProvider;

export const useUsers = () => {
  const user = useContext(UsersContext)
  return user
}