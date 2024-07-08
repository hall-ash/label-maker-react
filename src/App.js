// import logo from './logo.svg';
import './App.css';
import LabelForm from './LabelForm';
import { Container } from 'reactstrap';

function App() {
  return (
    <Container className='col-md-7'>
      <h1 className='mt-3 mb-3 text-center'>Label Maker</h1>
      <LabelForm />
    </Container>
  );
}

export default App;
