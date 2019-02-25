import React, {Component} from 'react';
import Main from './Main';
import Header from './Header';

class App extends Component {
    constructor(props) {
        super(props);

        // track current API login session
        // object is passed down component tree for children to access.
        this.state = {
          isLoggedIn: false,
          setLogin: this.setLogin,
        }
    }

    setLogin = (isLoggedIn) => this.setState({ isLoggedIn });

    render() {
        return (
          <div>
            <Header {...this.state} />
            <br />
            <Main {...this.state} />
          </div>
        );
    }
}

export default App;