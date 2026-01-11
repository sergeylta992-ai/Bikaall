import cls from './BIkePageApp.module.scss'
import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, setDoc} from 'firebase/firestore';
import { db } from '../../../config/FireBase/FireBase';
import { getSimpleBikeParts } from './hooks/getSimpleBikesParts';

const BikePage = () => {
  
type BikeName = string;

const [bikes,setBikes] = useState([])
const [parts,setParts] = useState([])
const [costs, setCosts] = useState<Record<BikeName, number | null>>({});

useEffect(()=>{
  GetBikes()
},[])

const GetBikes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bikes'));
    
    const data = querySnapshot.docs.map(doc=>{
      return {
        id:doc.id,
        ...doc.data()
      }
    })
    setBikes(data)
  
    console.log(data)
  } catch (error) {
    
  }
}

const getParts = async (bikeNumber:string)=> {
  console.log(bikeNumber)
  const part = await getSimpleBikeParts(bikeNumber)
  console.log(part)
}

const loadCost = async (bikeName:string) => {
  try {
    const cost = await getSimpleBikeParts(bikeName);
    setCosts(prev => ({
      ...prev,
      [bikeName]: cost.summary.totalCost
    }));
  } catch (error) {
    console.error('Error loading cost:', error);
  }
};

// Загружаем стоимость при монтировании
useEffect(() => {
  bikes.forEach(bike => {
    loadCost(bike.name);
  });
}, [bikes]);


  return (
   <>
    <div className={cls.wrap}>
      <h1>Велосипеды</h1>
      {bikes.map((bike:any) => (
        <div key={bike.name}>
          <div>{bike.name}</div>
          <button onClick={() => getParts(bike.name)}>history</button>
          <div>
            {costs[bike.name] !== undefined 
              ? `Total cost: ${costs[bike.name]}` 
              : 'Loading...'}
          </div>
        </div>
      ))}
    </div>
   </>
  );
};

export default BikePage;