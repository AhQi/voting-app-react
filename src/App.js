import React from 'react'
import Header from './components/header.js'
import Main from './components/main.js'
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {authenedStatus: {isAuthened:false, user: null}};
    
  }

  componentDidMount () {
    const persisState = localStorage.getItem('isAuthened');
    
    if (!persisState) {
      ;
    }else{
      this.setState({authenedStatus: JSON.parse(persisState)});
    }
  }
  
  componentWillUnmount () {
    localStorage.setItem('isAuthened', JSON.stringify(this.state));
  }
  
  loginChk = (newStatus) =>{
      console.log(newStatus);
      this.setState({authenedStatus: newStatus});
  };
    
  render() {
    return (
      <div>
        <Header authenedStatus={this.state.authenedStatus} />
        <Main loginChk={this.loginChk} authenedStatus={this.state.authenedStatus}/>
      </div>
    );
  }
}
export default App