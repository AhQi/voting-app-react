import React from 'react';


class Logout extends React.Component {

  componentDidMount(){
    const { history } = this.props;
    
    fetch('https://voting-app-backend.herokuapp.com/logout', {
	      method: 'GET',
	      credentials: 'include'
	    }).then((resp)=>{ 
	    	
	    	if(resp.status === 200){
	    		//console.log(resp.status);
	    		localStorage.setItem('isAuthened',  JSON.stringify({isAuthened:false, user: null}));
	    		this.props.loginChk({isAuthened:false, user: null});
                history.push('/');
	    	}else{
	    		console.log(resp);
	    	}
	    });
	    	
    
  }

  render() {
    return (
      <h1 className="loading-text">
        Logging out...
      </h1>
    );
  }
}

export default Logout;