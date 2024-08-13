import React from 'react';
import LabelForm from './LabelForm';
import { Container } from 'reactstrap';



const HomePage = () => {
  return (
    <Container className='col-md-7'>
      <h1 className='mt-3 mb-3 text-center'>Label Maker</h1>
      <LabelForm />
    </Container>
  );



}

export default HomePage;