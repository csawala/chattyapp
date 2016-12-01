import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'


class App extends Component {
  constructor (props){
    super(props)
    this.state = {
      prevUser: { name: 'Anonymous' },
      currentUser: { name: '' },
      messages: []
    }
  }


  handleUsername = (ev) => {    // MANAGE USERNAME BASED ON ChatBar INPUT
    this.setState({ currentUser: {name: ev.target.value}})
  }

  handleMessage = (ev) => {     // MANAGE NEW MESSAGE SUBMISSION BASED ON ChatBar INPUT
    this.setState({ message: ev.target.value })
    let currName = this.state.currentUser.name
    let prevName = this.state.prevUser.name
    let newMessage = {}

    if (ev.key === 'Enter') {     // 'SUBMIT'
      // SET USERNAME DEPENDING ON WHETHER NAME ENTERED (username || Anonymous)
      newMessage.username = (currName.length > 0)
        ? currName : 'Anonymous'
      newMessage.content = this.state.message

      // CHECK TO SEE IF USERNAME HAS CHANGED FROM LAST POST
      if (newMessage.username != prevName) {
        newMessage.type = 'postNotification'
        newMessage.typeContent =
          `${prevName} has changed their name to ${newMessage.username}`
        this.setState({ prevUser: { name: currName }})
      } else {
        newMessage.type = 'postMessage'
      }

      this.ws.send(JSON.stringify(newMessage))

      // RESET MESSAGE FIELD UPON SUCCESSFUL SUBMISSION
      this.setState({ message: '' })
      document.getElementById('new-message').value = ''
    }
  }


  componentDidMount() {
    this.ws = new WebSocket("ws://localhost:5000")

    this.ws.onopen = (event) => {
      console.log('Connected to WebSocket')
    }

    this.ws.onmessage = (fromWS) => {
      const messages = this.state.messages.concat(JSON.parse(fromWS.data))
      console.log("Messages from WS: ", messages)

      this.setState({ messages: messages })
    }
  }


  render() {
    return (
      <div className="wrapper">
        <nav>
          <h1>
            Chatty
          </h1>
        </nav>

        <MessageList messages={this.state.messages}/>
        <ChatBar currentUser={this.state.currentUser.name}
                  handleUsername={this.handleUsername}
                  handleMessage={this.handleMessage} />
      </div>
    );
  }
}
export default App