import cls from './AppHeader.module.scss'
import tiger from './../../img/tiger.png'
import logo from './../../img/logo.png'
import { useUsers } from '../../app/provider/UserPropvider/UserPropvider';
import { Navbar } from '../../widget/NavBar';
import Exit from "../../img/exit2.svg"
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUsers()

  const exit = ()=> {
       console.log(user)
      Cookies.remove('username');
      navigate('/')
      

  }

  return (
    <>
    <div className={cls.wrap}>
      <img src={tiger} alt="" className={cls.tiger}/>
      <img src={logo} alt="" className={cls.logo}/>
      {/* <h2>{user[0]?.name}</h2>
      <h2>{user[0]?.dark}</h2> */}
      <div>{user[0]?.role}</div>
      <Exit onClick={exit} width={34}/>
    </div>
    </>
  );
};

export default AppHeader;