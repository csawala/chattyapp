import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'


class App extends Component {
  constructor (props){
    super(props)
    this.state = {
      currentUser: { name: '' },
      messages: []
    }
  }


  handleUsername = (ev) => {
    this.setState({ currentUser: {name: ev.target.value}})
  }

  handleMessage = (ev) => {
    this.setState({ message: ev.target.value })
    let newMessage = {}

    if (ev.key === 'Enter') {
      if (this.state.currentUser.name.length > 0) {
        newMessage = {
          username: this.state.currentUser.name,
          content: this.state.message
        }
      } else {
        newMessage = {
          username: 'Anonymous',
          content: this.state.message
        }
      }

      this.ws.send(JSON.stringify(newMessage))
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
      console.log(messages)

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