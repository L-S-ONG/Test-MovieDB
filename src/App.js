import React from 'react';
import './App.css';
import Slider from 'react-slick';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';


function NextPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
      <div
          className={className}
          style={{ ...style, display: "block", background: "#0000008c", borderRadius: '100%' }}
          onClick={onClick}
      />
  );
}



var createReactClass = require('create-react-class');
/// COMPONENTS //

// Container
var App = createReactClass({
  apiKey: '6cf28c11ce1981a94ebf945ed9cf0f63',
  getInitialState: function() {
    return {searchTerm:"", searchUrl:""};
  },
  handleKeyUp :function(e){
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
      var searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
      this.setState({searchUrl:searchUrl});
    }
  },
  render: function() {
    return (
      <div>
        <header className="Header">
        <Navigation />
        </header>
        <TitleList title="Search Results" url={this.state.searchUrl} />
        <TitleList title="Popular Movies" url='movie/popular?' />
        <TitleList title="Popular Series" url='tv/popular?' />
        <TitleList title="Family" url='discover/movie?sort_by=popularity.desc&with_genres=10751' />
        <TitleList title="Documentary" url='discover/tv?sort_by=popularity.desc&with_genres=99' />
      </div>
    );
  }
});


// Navigation
var Navigation = createReactClass({
  render: function() {
    return (
      <div id="navigation" className="Navigation">
        <img src={require('./asset/LogoMakr_4XkwRA.png')} alt="logo"/>
      </div>
    );
  }
});


// Title List //

// Title List Container

var TitleList = createReactClass({

  apiKey: '6cf28c11ce1981a94ebf945ed9cf0f63',
  getInitialState: function() {
    return {data: [], mounted: false};
  },
  loadContent: function() {
    var requestUrl = 'https://api.themoviedb.org/3/' + this.props.url + '&api_key=' + this.apiKey;
    fetch(requestUrl).then((response)=>{
        return response.json();
    }).then((data)=>{
        this.setState({data : data});
    }).catch((err)=>{
        console.log("There has been an error");
    });
  },
  componentWillReceiveProps : function(nextProps){
    if(nextProps.url !== this.props.url && nextProps.url !== ''){
      this.setState({mounted:true,url:nextProps.url},()=>{
        this.loadContent();
      });
      
    }
  },
  componentDidMount: function() {
    if(this.props.url !== ''){
      this.loadContent();
      this.setState({mounted:true});
    }
    
  },
  render: function() {
    var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            initialSlide: 0,
            nextArrow: <NextPrevArrow />,
            prevArrow: <NextPrevArrow />
        };
    var titles ='';
    if(this.state.data.results) {
      titles = this.state.data.results.map(function(title, i) {
        if(i < 100) {
          var name = '';
          var backDrop = 'http://image.tmdb.org/t/p/original' + title.backdrop_path;
          if(!title.name) {
            name = title.original_title;
          } else {
            name = title.name;
          }

          return (
            <Item key={title.id} title={name} score={title.vote_average} overview={title.overview} backdrop={backDrop} />
          );  

        }else{
          return (<div key={title.id}></div>);
        }
      }); 

    } 
    
    return (
        <div ref="titlecategory" className="TitleList" data-loaded={this.state.mounted}>
          <div className="Title">
            <h1>{this.props.title}</h1>
            <div className="titles-wrapper">
              <Slider {...settings}>
                {titles}
              </Slider>
            </div>
          </div>
        </div>
    );
  }
});


const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    
  },
}));



// Title List Item
var Item = createReactClass({
  getInitialState: function() {
    return({ open: false })
  },
  handleClick: function() {
    if(this.state.open === true){
      this.setState({ open: false }); 
    }else{
      this.setState({ open: true }); 
    }
  },
  handleCloseClick: function(e) {
  },
  render: function() {
    return (
      <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >
        <div className="overlay" onClick={this.handleClick}>
          <div className="title">{this.props.title}</div>
          <div className="rating">{this.props.score} / 10</div>
          <div className="plot">{this.props.overview}</div>
          <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={useStyles.modal}
              open={this.state.open}
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <div style={{ padding:'8%', width:'-webkit-fill-available', height:'-webkit-fill-available', backgroundColor: '#424242', color:'white', border:'2px solid #000', boxShadow: 'theme.shadows[5]'}}>
                <div style={{width:'50%', float:'left'}}>
                  <h2 id="simple-modal-title">{this.props.title}</h2>
                  <h3>{this.props.score} / 10</h3>
                  <p id="simple-modal-description">
                    {this.props.overview}
                  </p>
                  <Button variant="contained" onClick={this.handleClick} color="secondary" style={{marginRight:'20px'}}>
                    Close
                  </Button>
                  <Button variant="contained" color="primary">
                    Play Trailer
                  </Button>
                </div>
                <img src={this.props.backdrop} alt="Backdrop" style={{width:'40%', marginLeft:'10%'}}/>
              </div>
            </Modal>
        </div>
      </div>
    );
  }
});



export default App;