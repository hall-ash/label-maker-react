import { Container } from 'reactstrap';
import React from "react";

const AboutPage = () => {
  return (
    <Container className='col-md-7'>
      <h1>About</h1>
      
      <h2>Skipping Labels Instructions</h2>
      <p>
        Columns are labeled by letters (A-E), and rows are labeled by numbers (1-17). 
        The first label on a sheet with 5 columns and 17 rows is <strong>A1</strong>, and the last label is <strong>E17</strong>.
      </p>
      <p>
        You can prevent printing on specific labels by adding them to the “skip labels” input. 
        The format follows this structure: <code>pg_no: label, label-label</code>.
      </p>
      
      <h3>Examples:</h3>
      <ul>
        <li>To skip the first row of labels on the first page: <code>1: A1-E1</code></li>
        <li>To skip specific labels on the second page: <code>2: B3, D11, A17</code></li>
        <li>To skip all the labels mentioned above:
          <pre>
1: A1-E1
2: B3, D11, A17
          </pre>
        </li>
      </ul>

      <p>Ensure that each page of skipped labels is on a new line.</p>

      <p>Teams me for questions</p>
    </Container>
  );
}

export default AboutPage;
