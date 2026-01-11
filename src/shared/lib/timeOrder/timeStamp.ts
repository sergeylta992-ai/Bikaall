import { Timestamp } from 'firebase/firestore';



export function timeOrder (Time:Timestamp) {

  const now = new Date()
  const targetTime = Time.toDate()
  const difference = now.getTime() - targetTime.getTime()

  if ( difference <= 0 ) {
    return '00:00'
  }

// Более точное вычисление с учетом полных 24 часов
    const totalMinutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} `;
}