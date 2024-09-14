import React from 'react';
import LabelForm from './LabelForm';
import { Container } from 'reactstrap';
import './HomePage.css';

const HomePage = () => {

  const showTitle = false;

  const title = <h1 className='mt-3 mb-3 text-center'>Create Your Labels</h1>;
  
  return (
    <Container className='col-md-7'>
      {showTitle && title}
      <LabelForm />
      
    </Container>
  );
}

export default HomePage;
