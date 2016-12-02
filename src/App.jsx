import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'


class App extends Component {
  constructor (props){
    super(props)
    this.state = {
      prevUser: { name: 'Anonymous' },
      currentUser: { name: '' },
      messages: [],
      loggedUsers: 0
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
      let receiveParsed = JSON.parse(fromWS.data)
      let messages = this.state.messages.concat(receiveParsed)
      // console.log("Messages from WS: ", receiveParsed)

      switch (receiveParsed.type) {
        case 'loggedUsers':
          this.setState({ loggedUsers: receiveParsed.quantity })
          break;
        case 'postNotification':
        case 'postMessage':
          this.setState({ messages: messages })
          break;
        default:
          console.log('Something fell through the cracks')
      }
    }
  }


  render() {
    return (
      <div className="wrapper">
        <nav>
          <h1 className="title">Chatty</h1>
          <div className="loggedUsers">{this.state.loggedUsers} users online</div>
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