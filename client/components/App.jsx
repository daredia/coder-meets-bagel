import axios from 'axios';
import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {link: '', android: false, response: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value, response: ''});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.link) {
      return axios.post('/api/redeem', {url: this.state.link, android: this.state.android})
      .then((res) => {
        this.textInput.focus()
        this.setState({response: JSON.stringify(res.data, null, 2), link: ''});
      });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="link" type="text" name="link" value={this.state.link}
              onChange={this.handleChange} autoFocus
              ref={(input) => { this.textInput = input; }} />
          <input type="checkbox" name="android" value={this.state.android}
              onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
        <p>{this.state.response}</p>
      </div>
    );
  }
}