import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Select from 'react-select';

// Deploy instructions:
// Use Heroku.
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: "",
      question: "",
      answer: "🤔",
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
      question_array: [],
      q_text_to_display: "",
      i: 0
    };
  }
  
  componentDidMount() {
    setInterval(() => this.startQuiz(),1000)
  }

  getQuestion() {
    this.setState({q_text_to_display: ""})
    this.setState({i: 0})
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
          this.setState({question_array: this.state.question.split(" ")})
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

  jump() {
    console.log('question_array')
    console.log(this.state.question_array)
    this.setState({i: this.state.question_array.length})
  }

  showFullQuestion() {
    this.setState({q_text_to_display: this.state.question})
    this.setState({i: this.state.question_array.length})
  }
    
  startQuiz() {
    var {
      question,
      q_text_to_display,
      i
    } = this.state

    this.question_array = question.split(" ")
    if (i < this.question_array.length) {
        q_text_to_display = q_text_to_display.concat(this.question_array[i]).concat(' ')
        i++
        this.setState({ q_text_to_display: q_text_to_display, i: i })
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
          <h3>Question: {this.state.q_text_to_display}</h3>
          <h3>Answer: {this.state.answer}</h3>
        </div>
        <div>
        <Button onClick={()=>this.getQuestion()} variant="secondary">Next Question</Button>{' '}
        <Button onClick={()=>this.showFullQuestion()} variant="secondary">Full Question</Button>{' '}
        <Button onClick={()=>this.showAnswer()} variant="secondary">Show Answer</Button>{' '}
        <Button onClick={()=>this.jump()} variant="secondary">Jump</Button>{' '}        
        </div>
        <div>
          Question Type:
          <Select defaultValue={this.state.questionTypes[0]} options={this.state.questionTypes} onChange={this.handleQTypeChange.bind(this)}/>
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
