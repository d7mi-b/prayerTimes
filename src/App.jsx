import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMosque } from '@fortawesome/free-solid-svg-icons'

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('الرجاء الإنتظار قليلًا...')

  const watchLoacation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(setPosition, handleError);
      setDate()
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function setPosition(position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude)
  }

  function handleError(error) {
    let errorStr;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorStr = 'الوصول للموقع غير متاح من قِبلك.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorStr = 'معلومات الموقع غير متاحة.';
        break;
      case error.TIMEOUT:
        errorStr = 'إنتهى الوقت للحصول على معلومات الموقع.';
        break;
      case error.UNKNOWN_ERROR:
        errorStr = 'حدث خطأ غير معروف.';
        break;
      default:
        errorStr = 'حدث خطأ غير معروف.';
    }
    setMessage(errorStr);
  }
  

  function setDate () {
    const date = new Date();
    setDay(date.getDate())
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
  }

  const getPrayerTimes = (latitude, longitude, month, year) => {
    fetch(`https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2&month=${month}&year=${year}`)
    .then(res => res.json())
    .then(data => setData(data.data[day - 1]))
    .catch(err => console.log(err))
  }

  useEffect(() => {
    watchLoacation();
    if (latitude && longitude && month && year)
      getPrayerTimes(latitude, longitude, month, year);

  }, [latitude, longitude, month, year])

  return (
    <div className="App">
      <nav className='navbar'>
        <p>مواقيت الصلاة</p>
        <FontAwesomeIcon icon={faMosque} size="lg" />
      </nav>
      <main>
        <h3 className='ayah'>إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا</h3>
        <h2>يوم {data && data.date.hijri.weekday.ar} {data && data.date.hijri.date} الموافق {data && data.date.gregorian.date}</h2>
        <h4>الوقت الحالي: {new Date().getHours()}:{new Date().getMinutes()}</h4>
      </main>
      {
        data && 
        <div className='container'>
          <article className='prayer-times'>
            <header className='header'>
              <h2>مواقيت الصلاة</h2>
            </header>
            <section className='times'>
              <section className='time'>
                <p>الفجر</p>
                <p className='prayer-time'>{data && data.timings.Fajr}</p>
              </section>
              <section className='time'>
                <p>الشروق</p>
                <p>{data && data.timings.Sunrise}</p>
              </section>
              <section className='time'>
                <p>الظهر</p>
                <p className='p'>{data && data.timings.Dhuhr}</p>
              </section>
              <section className='time'>
                <p>العصر</p>
                <p>{data && data.timings.Asr}</p>
              </section>
              <section className='time'>
                <p>المغرب</p>
                <p>{data && data.timings.Maghrib}</p>
              </section>
              <section className='time'>
                <p>العشاء</p>
                <p>{data && data.timings.Isha}</p>
              </section>
              <section className='time'>
                <p>الإمساك</p>
                <p>{data && data.timings.Imsak}</p>
              </section>
            </section>
          </article>
        </div>
      }
      {
        !data && 
        <p className='loading'>{message}</p>
      }
      <footer className='footer'>
        <p>مواقيت الصلاة</p>
        <p>جميع الحقوق محفوظة <a target='_blank' href='https://github.com/d7mi-b'>عبدالرحمن</a> &copy; 2022 - المكلا - حضرموت - اليمن</p>
      </footer>
    </div>
  )
}

export default App
