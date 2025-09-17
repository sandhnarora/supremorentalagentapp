import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TopMostToolBar from '../toptoolbar';
import TopNavBarN from '../TopNavBarN';
import FooterSection from '../Footer';

function AboutUs({ onLogout, userJsonVal, bookingCount }) {
  const [userDataN, setUserData] = useState([userJsonVal]);

  const [backendData, setBackendData] = useState([]);
  const [carsCountData, setcarsCountData] = useState([]);
  const getUserId = localStorage.getItem('userid');
  const nav = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('userid');
    nav('/');
  };


  useEffect(() => {
    if (getUserId) {
      console.log('Fetching data for user ID:', getUserId);
      fetch(`${process.env.REACT_APP_BACKEND_SERVICE_IP}/order-service/user-orders?userid=${getUserId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from server:)) ", data);
          setBackendData(data);
          setcarsCountData(data);
        })
        .catch((err) => {
          console.log('Error fetching data:', err);
        });
    }
  }, [getUserId]);


  return (
    <>
      <div>
        <TopMostToolBar />
        <TopNavBarN onLogout={handleLogout} userJsonVal={userDataN} bookingCount={carsCountData.length} />

        <section class="ftco-section1 bg-light my-4"><div class="container-fluid"><div class="row"><div class="col-md-12  px-md-5 featured-top11"><div class="row no-gutters"><div class="col-md-12 d-flex align-items-center bg-primary" ><form action="#" class="request-form bg-primary fadeInUp text-left w-100 cardetailsForm"><h2>About Us</h2><div class="d-flex"></div></form></div><div class="col-md-12 d-flex align-items-center carBigImage"><div class="services-wrap2 rounded-right w-100 text-left"><div class="container-fluid"><div class="row"><div class="col-md-12"><p>Welcome to Supremo Rental, your go-to destination for hassle-free car rentals in Australia! With four years of unwavering commitment to excellence, Supremo Rental has emerged as a trusted name in the car rental industry. Our primary focus is to provide our customers with the flexibility they need, offering car rentals on an hourly basis.</p><p>At Supremo Rental, we take pride in maintaining a fleet of the latest and most stylish cars to suit your needs. Whether you're looking for a compact car for a quick city excursion or a spacious SUV for a family road trip, we've got you covered. Our diverse selection of vehicles ensures that you can find the perfect ride for any occasion.</p><p>Customer satisfaction is at the heart of what we do, and our impressive ratings reflect the dedication we have towards providing top-notch service. We understand the importance of a reliable and comfortable vehicle, and that's why we go the extra mile to ensure that our cars are well-maintained and up to the highest standards.</p><p>Convenience is key when it comes to Supremo Rental. Our user-friendly platform allows you to easily book a car online, making the process quick and efficient. Whether you need a vehicle for a few hours or an entire day, Supremo Rental is here to cater to your specific requirements. Experience the joy of driving the latest models without the burden of ownership – choose Supremo Rental for a seamless and enjoyable car rental experience in and around Australia.</p></div></div><div class="row"><div class="text-center col"><button class="btn btn-dark mt-4"> Home </button></div></div></div></div></div></div></div></div></div></section>


        <FooterSection />
      </div>
    </>
  );
}

export default AboutUs;