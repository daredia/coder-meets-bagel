import axios from 'axios';
import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: '',
      android: false,
      response: '',
      bagelPics: [],
      success: false,
      error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [target.name]: value,
      response: '',
      bagelPics: [],
      success: false,
      error: false
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.link) {
      return axios.post('/api/redeem', {url: this.state.link, android: this.state.android})
      .then((res) => {
        this.textInput.focus();
        let nextState = {response: JSON.stringify(res.data, null, 2), link: ''};
        if (res.data.bagelProfileData) {
          nextState.bagelPics = res.data.bagelProfileData.profile.photos;
        }
        if (res.data.data && res.data.data.success === false) {
          nextState.error = true;
        } else {
          nextState.success = true;
        }
        this.setState(nextState);
      });
    }
  }

  getSuccessOrError() {
    if (this.state.success) {
      return 'success';
    }
    if (this.state.error) {
      return 'error';
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
        {this.state.bagelPics.map(pic => <img src={pic.thumbnail} />)}
        <p className={this.getSuccessOrError()}>{this.state.response}</p>
      </div>
    );
  }
}