import React from 'react';
import { Link } from 'react-router-dom';
import {Doughnut} from 'react-chartjs-2';
//import Modal, {closeStyle} from 'simple-react-modal';
import '../main.css';
import {Helmet} from "react-helmet";
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
//Modal.setAppElement('#PollDetail');

var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() *42323  % 255);
    var b = Math.floor(Math.random() *78571 % 255);
    return "rgb(" + r + "," + g + "," + b + ")";
}

// 整個 App 的主要元件，這邊比較重要的是事件處理的部份，內部有
class PollDetail extends React.Component {
	constructor(props) {
		super(props);
		//console.log(props);
		this.handleVote = this.handleVote.bind(this);
		this.deletePoll = this.deletePoll.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onClose = this.onClose.bind(this);
		this.handleOptionAdd = this.handleOptionAdd.bind(this);
		this.openModal = this.openModal.bind(this);
	    this.afterOpenModal = this.afterOpenModal.bind(this);
	    this.closeModal = this.closeModal.bind(this);
		this.state = {modalIsOpen: false, text:'', confirm: false, shareLink:'',showAddOptionBtn: false, newOption: '', alertMsg:'', data: {}, pollTitle:'Now Loading', options:[], color:[], isPollOwner: false, show: false};
	}
	openModal() {
	    this.setState({modalIsOpen: true});
	  }

	afterOpenModal() {
    	// references are now sync'd and can be accessed.
    	this.subtitle.style.color = '#f00';
	}

	closeModal() {
	  this.setState({modalIsOpen: false});
	}
	
	onClose(){
	    this.setState({show: false, confirm: false})
	}
	
	onChange(e) {
    	this.setState({newOption: e.target.value});
	}
	
	
	moveCaretAtEnd(e) {
	  var temp_value = e.target.value
	  e.target.value = ''
	  e.target.value = temp_value
	}

	deletePoll(e) {
    	e.preventDefault();
    	this.setState({modalIsOpen: false});
    	fetch('https://voting-app-backend.herokuapp.com/DELETE/polls/' + this.props.match.params.id, {
    	   method: 'DELETE',
    	   credentials: 'include'
    	}).then((resp)=>{ 
	    	const { history } = this.props;
	    	if(resp.status === 200){
                history.push('/');
	    	}else{
	    		console.log(resp);
	    	}
	    });
	}
	
	handleVote(e){
		e.preventDefault();

		const data = {
	      	option: e.target.id
	     };
	     
		fetch('https://voting-app-backend.herokuapp.com/PUT/polls/' + this.props.match.params.id, {
    	   method: 'PUT',
    	   body: JSON.stringify(data),
    	   credentials: 'include',
    	   headers: {
	        'Content-Type': 'application/json'
	      }
    	}).then((resp)=>{ return resp.json() })
    	.then((respData)=>{ 
    	    console.log(respData.poll.options);

    	    this.setState({pollTitle: respData.poll.title});

    	    
    	    var optionLabel = [];
    	    var optionCnt = [];
    	    respData.poll.options.forEach((val)=>{
    	      optionLabel.push(val.option);
    	      optionCnt.push(val.count);
    	      console.log(val);
    	    });
    	    
    	    const data = {
          	labels: optionLabel,
          	datasets: [{
          		data: optionCnt,
          		backgroundColor: this.state.color,
          		hoverBackgroundColor: this.state.color
          	}]
          };
          this.setState({data: data});
          
    	    //console.log(this.state.polls);
    	}); 
	}
	
	handleOptionAdd(e){
		e.preventDefault();
		if(this.state.newOption.trim() === ''){
			this.setState({alertMsg: "You can't add empty option!" });
    		return this.setState({show: true});
		}
		const { history } = this.props;
		const data = {
	      	option: this.state.newOption
	     };
	     
		fetch('https://voting-app-backend.herokuapp.com/PUT/polls/newOption/' + this.props.match.params.id, {
    	   method: 'PUT',
    	   body: JSON.stringify(data),
    	   credentials: 'include',
    	   headers: {
	        'Content-Type': 'application/json'
	      }
    	}).then((resp)=>{ return resp.json() })
    	.then((respData)=>{ 
    	    console.log(respData.poll.options);

    	    this.setState({pollTitle: respData.poll.title});
			this.setState({options: respData.poll.options});
    	    
    	    var optionLabel = [];
    	    var optionCnt = [];
    	    var color = this.state.color;
    	    color.push(dynamicColors());
    	    
    	    respData.poll.options.forEach((val)=>{
    	      optionLabel.push(val.option);
    	      optionCnt.push(val.count);
    	      console.log(val);
    	    });
    	    
    	    const data = {
          	labels: optionLabel,
          	datasets: [{
          		data: optionCnt,
          		backgroundColor: color,
          		hoverBackgroundColor: color
          	}]
          };
          this.setState({data: data, color: color, newOption: ''});
          
    	    //console.log(this.state.polls);
    	}); 
	}
	
    componentDidMount(){ 
    	console.log(this.props.authenedStatus);
        
    	fetch('https://voting-app-backend.herokuapp.com/GET/polls/' + this.props.match.params.id, {
    	   method: 'GET',
    	   credentials: 'include'
    	}).then((resp)=>{ return resp.json() })
    	  .then((respData)=>{ 
    	    console.log(respData.poll.title);

    	    this.setState({pollTitle: respData.poll.title});
    	    this.setState({options: respData.poll.options});
    	    this.setState({text: ''});
    	    
    	    if(respData.owner.email === this.props.authenedStatus.user){
    	    	console.log('is owner');
    	    	this.setState({isPollOwner: true});	
    	    }
    	    
    	    var optionLabel = [];
    	    var optionCnt = [];
    	    var color = [];
    	    respData.poll.options.forEach((val)=>{
    	      optionLabel.push(val.option);
    	      optionCnt.push(val.count);
    	      color.push(dynamicColors());
    	    })
    	    
    	    const data = {
          	labels: optionLabel,
          	datasets: [{
          		data: optionCnt,
          		backgroundColor: color,
          		hoverBackgroundColor: color
          	}]
          };
          this.setState({data: data, color: color});
          this.setState({shareLink: 'https://www.facebook.com/sharer/sharer.php?u='+window.location.href});
          if(this.props.authenedStatus.isAuthened){
          	this.setState({showAddOptionBtn: true});
          }
    	    //console.log(this.state.polls);
    	}); 
        
    	
    	
    }
    
	render() {
		const ShowAddNewOptionBtn = ()=>(
			<p>	
				<input autoFocus onFocus={this.moveCaretAtEnd} className="text-input" onChange={this.onChange} value={this.state.newOption} />
				<button className="add-option-button" type="button" onClick={this.handleOptionAdd}>{'Add Option'}</button>
			</p>
		)
		
		const ShowVotesBtn = (props) => (
			props.showOptions.map((options, idx) => (
			<p key={idx}>	<button className="button" type="button" onClick={this.handleVote} key={idx} id={idx}>
						{options.option}
				</button>
			</p>
			))
			
		)
		
		const ShowRemoveBtn = ()=>(
			<p>
			<button className="remove-button" type="button" onClick={this.openModal}>
					delete
			</button>
	        <Modal
	          isOpen={this.state.modalIsOpen}
	          onAfterOpen={this.afterOpenModal}
	          onRequestClose={this.closeModal}
	          style={customStyles}
	          contentLabel="RemovePoll Modal"
	        >
	
	          <h2 ref={subtitle => this.subtitle = subtitle}>Confirm</h2>
	          <h3>Are you sure you want to remove the poll?</h3>
	          <button onClick={this.deletePoll}>Yes</button>
	          <button onClick={this.closeModal}>No</button>
	        </Modal>
			
			</p>
		)	

		
	    return (
	      <div>
			<Helmet>
		        <title>Your Poll</title>
		        <meta name="poll detail" content="" />
		    </Helmet>

			
			<div className="row">
			<div className="inline-option">
			     <ShowVotesBtn  showOptions={this.state.options} />
				 {this.state.showAddOptionBtn && <ShowAddNewOptionBtn  />}
			     
		    </div>
		    <div className="inline-pic">
		    	<h2>{this.state.pollTitle}</h2>
		        <Doughnut data={this.state.data} />
		    	{this.state.isPollOwner && <ShowRemoveBtn  />}
		    	<a href={this.state.shareLink} target="_blank">
					Share on Facebook
				</a>
		    </div>
		    </div>
			
	      </div>
	      
	      
	    );
	}
}
export default PollDetail;

