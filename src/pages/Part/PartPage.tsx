import cls from './PartPage.module.scss'
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, setDoc,deleteDoc} from 'firebase/firestore';
import { db } from '../../../config/FireBase/FireBase';
import AddPartModal from '../../widget/modal/addPart/AddPartModal';
import Loader from '../../components/loader/loader';
import { timeOrder } from '../../shared/lib/timeOrder/timeStamp';
import Set from '../../img/set.svg'
import Del from '../../img/del2.svg'
import His from '../../img/ifeed.svg'
import { Navbar } from '../../widget/NavBar';
import HistoryModal from './historymodal/historyModal';
const PartPage = () => {

// interface partsType {
//   name:String,
//   prise:Number
// }
const [Loading,setLoading]= useState(true)
const [parts,setParts] = useState([])
const [part,setPart] = useState([])
const [parthistory,setParthistory] = useState([])
const [modalAdd,setmodalAdd] = useState(false)
const [modalpart,setModalPart] = useState({})
const [historyView,sethistoryView] = useState(false)

useEffect( () =>{
  getPart()
},[])

 const getPart = async () => {
      setLoading(true)
      try {
          console.log('🔄 Функция click запущена...');
          const querySnapshot = await getDocs(collection(db, 'parts'));
          console.log('✅ Данные получены:', querySnapshot.docs);
          console.log('📊 Документов:', querySnapshot.size);
          const data = querySnapshot.docs.map(doc=>{
           return {
             id:doc.id,
            ...doc.data()
           } 
          })
          setParts(data)
          console.log(data)
        } catch (error) {
          console.error('❌ Ошибка:', error);
        } finally {
          setLoading(false)
        }
    } 
const AddModal = () => {
 setmodalAdd(prev=>!prev)
}



const delpart = async (id:string)=> {
  const delitepart = parts.filter((data)=>data.id!=id)
  
  console.log(id)
    try{
      const docRef = doc(db,"parts",id)
      await deleteDoc(docRef)
      const delitepart = parts.filter((data)=>data.id!=id)
      setParts(delitepart)
    } catch {
      console.log("error")
    } finally {
      console.log('Успешно удален')
    }

}

const historyPart= async (part:any)=>{
  console.log(part)
  try {
    const querySnapshot = await getDocs(collection(db,'parts',part.id,'history'));

    const data = querySnapshot.docs.map(doc=>{
     return {

      ...doc.data()
     } 
    })
    setParthistory(data)
    console.log(data)
  } catch (error) {
    console.log(error)
  }

}


  return (
    <>
    <Navbar/>
       <Loader load={Loading}/>
      <AddPartModal 
      modal={modalAdd}
      close={AddModal}
      part={parts}
      getpart={getPart}
      />
      <HistoryModal
        view={historyView}
        part={part}
        parthistory={parthistory}
        
      />
      <h1>Запчасти</h1>
      <button onClick={AddModal}>добавить</button>
      <table>
          <thead>
            <tr>
           
                <th>Название</th>
                <th>Цена</th>
                <th>Кол-во</th>
            </tr>
        </thead>
        <tbody >
              {parts.map((data,index)=>(
              <tr >
                    
                    <td>{data.name}</td>
                    <td>{data.prise}</td>
                    <td>{data.count}</td>
                    <td><Set width={24}/></td>
                    <td><Del onClick={()=>delpart(data.id)} width={24}/></td>
                    <td><His onClick={()=>historyPart(data)}width={60} stroke="white"/></td>
                </tr>

                ))}
          </tbody>
      </table>
    </>
  );
};

export default PartPage;