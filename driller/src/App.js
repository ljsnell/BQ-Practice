import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Select from 'react-select';

// Deploy instructions
// https://medium.com/better-programming/deploy-a-react-app-to-google-cloud-platform-using-google-app-engine-3f74fbd537ec
// gcloud config set project quiz-driller
// gcloud app deploy
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: "",
      question: "",
      answer: "🤔",
      showAnswer: false,
      qtype: 1,
      selectedChapters: [1,2,3,4,5],
      questionTypes: [{value: 1, label: "General"},
                      {value: 2, label: "Two Part"},
                      {value: 3, label: "Three Part"},
                      {value: 4, label: "Four Part"},
                      {value: 5, label: "Five Part"},
                      {value: 6, label: "Multiple Part"},
                      {value: 7, label: "FTV"},
                      {value: 8, label: "Reference"},
                      {value: 9, label: "Situation"}],      
    };
  }
  
  getQuestion() {    
    // fetch('http://localhost:5000/filtered?qtype=' + this.state.qtype + '&books=1&chapters=' +
    //  this.state.selectedChapters)
    fetch('https://bq-questions-api.uc.r.appspot.com//filtered?qtype=' + this.state.qtype + '&books=1&chapters=' +
      this.state.selectedChapters)
      .then(res => res.json()).then((data) => {
        console.log('question from api!')
        console.log(data)
        if(data != null) {
          this.setState({question: (data[9] + data[15])})
          this.setState({data: data})
          this.setState({answer: "🧐"})
        } else {
          this.setState({question: 'No question found for that criteria, FeelsBadMan'})
          this.setState({answer: "😭"})
          this.setState({data: data})
        }
    });
  }

  showAnswer() {
    if(this.state.data != null) {
      this.setState({answer: this.state.data[11]})
    }    
  }

  handleQTypeChange(e){
    this.setState({qtype:e.value})
   }

  handleChaptersChange(e){
    this.setState({selectedChapters:e.target.value})
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3>Question: {this.state.question}</h3>
          <h3>Answer: {this.state.answer}</h3>
        </div>
        <div>
        <Button onClick={()=>this.getQuestion()} variant="secondary">Next Question</Button>{' '}
        <Button onClick={()=>this.showAnswer()} variant="secondary">Show Answer</Button>{' '}
        </div>
        <div>
          Question Type:
          <Select options={this.state.questionTypes} onChange={this.handleQTypeChange.bind(this)}/>
        </div>
        <div>
          Selected Chapters (e.g. 1,2,3 for chapters 1-3)
          <br></br>
          <input value={this.state.selectedChapters} options={this.state.selectedChapters} onChange={this.handleChaptersChange.bind(this)}/>
        </div>
        <br></br>
      </React.Fragment>
    );
  }
}

export default App;
