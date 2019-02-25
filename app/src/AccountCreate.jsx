import { withRouter } from 'react-router-dom';
import React, { useState } from 'react';
import {Container, Button, Form, FormGroup, Label, Input, Row, Col, Jumbotron} from 'reactstrap';
import {callApi} from "./utils";

const AccountCreate = () => {
    const createAccount = (username, password) => {
        callApi('account', 'POST', JSON.stringify({ username, password })).then(result => {
            if (result.status === 201) {
                setMessage('Successfully created account.')
            } else {
                result.json().then(data => {
                    setMessage(`Error creating account${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };

    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    return (
      <Container>
          <Row>
              { message || '\u00A0' }
          </Row>
          <Jumbotron>
              <h3>Create New Account</h3>

              <Row>
                  <Col className="col-3" />
                  <Col className="col-3 col-auto">
                      <Form>
                          <FormGroup>
                              <Label for="username">Username</Label>
                              <Input type="text" name="username" onChange={e => onChange(e.target.name, e.target.value)}  />
                          </FormGroup>
                          <FormGroup>
                              <Label for="password">Password</Label>
                              <Input type="password" name="password" id="password" onChange={e => onChange(e.target.name, e.target.value)} />
                          </FormGroup>
                      </Form>
                      <Button onClick={() => createAccount(form.username, form.password)}>Create Account</Button>
                  </Col>
              </Row>
          </Jumbotron>

      </Container>
    )
};
export default withRouter(AccountCreate);
