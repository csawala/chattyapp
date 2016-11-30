import React, {Component} from 'react';


class ChatBar extends Component {
  render() {
    return (
      <footer>
        <input id="username" type="text" placeholder='Your Name (Optional)'
            value={ this.props.currentUser }
            onChange={ this.props.handleUsername } />
        <input id="new-message" type="text" placeholder='Type a message and hit ENTER'
            value={ this.props.message }
            onKeyUp={ this.props.handleMessage } />
      </footer>
    )
  }
}


export default ChatBar