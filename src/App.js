// import logo from './logo.svg';
// import './App.css';
import AliquotList from './AliquotList';
import AliquotInputList from './AliquotInputList';
import LabelForm from './LabelForm';
import { Container } from 'reactstrap';

function App() {
  return (
    <Container className='col-lg-7'>
      <h1 className='mb-3 text-center'>Label Maker</h1>
      <LabelForm />
    </Container>
  );
}

export default App;
