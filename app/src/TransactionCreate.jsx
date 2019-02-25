import {withRouter} from 'react-router-dom';
import React, {useState} from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import {callApi} from "./utils";

const TransactionCreate = () => {
  const createTransaction = (memo, amount, date, transactionType) => {
    callApi('transactions', 'POST', JSON.stringify({memo, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        setMessage('Transaction created.');
        setForm({memo: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});
      } else {
        result.json().then(data => {
          setMessage(`Error creating account${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const [form, setForm] = useState({memo: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});
  const [message, setMessage] = useState('');

  const onChange = (name, value) => {
    setForm({...form, [name]: value});
  };

  return (
    <Container>
      <Row>
        {message || '\u00A0'}
      </Row>
      <Jumbotron>
        <h3>Create Transaction</h3>
        <Row>
          <Col className="col-3"/>
          <Col className="col-3 col-auto">
            <Form>
              <FormGroup>
                <Label for="memo">Memo</Label>
                <Input name="memo" onChange={e => onChange(e.target.name, e.target.value)} required/>
              </FormGroup>
              <FormGroup>
                <Label for="amount">Amount</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" name="amount" value={form.amount}
                         onChange={e => onChange(e.target.name, e.target.value)} required/>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input type="date" name="date" onChange={e => onChange(e.target.name, e.target.value)} required/>
              </FormGroup>
              <FormGroup>
                <Label for="type">Type</Label>
                <Input type="select" name="transactionType" onChange={e => onChange(e.target.name, e.target.value)}
                       required>
                  <option>DEPOSIT</option>
                  <option>WITHDRAWAL</option>
                </Input>
              </FormGroup>
            </Form>
            <Button onClick={() => createTransaction(form.memo, form.amount, form.date, form.transactionType)}>Add
              Transaction</Button>
          </Col>
        </Row>
      </Jumbotron>

    </Container>
  )
};
export default withRouter(TransactionCreate);
