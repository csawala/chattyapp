import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    return (
      <div id="message-list">
        {
          this.props.messages.map(function(values) {
            return <Message key={values.id} msg={values} />
          })
        }
      </div>
    )
  }
}

export default MessageList