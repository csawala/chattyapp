import React, {Component} from 'react';


class Message extends Component {
  render() {
    let notificationCheck = null

    if (this.props.msg.type = 'postNotification') {
      notificationCheck = (
        <div className="message system">
            <span>{this.props.msg.typeContent}</span>
        </div>
      )
    }

    return (
      <div>
        {notificationCheck}
        <div className="message">
          <span className="username">{this.props.msg.username}:</span>
          <span className="content">{this.props.msg.content}</span>
        </div>
      </div>
    )
  }
}

export default Message


