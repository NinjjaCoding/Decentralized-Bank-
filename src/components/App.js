import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    //check if MetaMask exists
    if(typeof window.ethereum !== 'undefined') {
      //connect our dapp to blockchain or ganache metamask 
    const web3 = new Web3(window.ethereum)
    const netId = await web3.eth.net.getId() //chechs network we are connected to 
    const accounts = await web3.eth.getAccounts()

    //load balance 
    if(typeof accounts[0] !== 'undefined') {
      const balance = await web3.eth.getBalance(accounts[0])
    this.setState({ account: accounts[0], balance: balance, web3: web3 })
    } else {
      window.alert('Plese login with Metamask')
    }
    //load contract 
    try {
      //assign to values to variables: web3, netId, accounts--create a new javascript contract using web3
      const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
      const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
      const dBankAddress = dBank.networks[netId].address
      this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress}) //update  dapp state
    } catch (e) {
      console.log('Error, e')
      window.alert('Contract not depolyed to current network')
    }
  } else {
      window.alert('Please install Metamask')
    } 

      //check if account is detected, then load balance&setStates, elsepush alert

      //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
      if(this.state.dbank !== 'undefined') {
        try{ 
          await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account}) 
        } catch (e) {
          console.log("Error: deposit: ", e)
        }
      }
  }

  async withdraw(e) {
    //prevent button from default click
    e.preventDefault()
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
    if(this.state.dbank !== 'undefined') {
      try {
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      } catch (e) {
        console.log('Error:, withdraw: ', e)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>weoclome to Decentalized Bank </h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey='deposit' title="Deposit">
                  <div>
                    <br></br>
                      How much do you want to deposit? 
                      <br></br>
                      (min. amount is 0.01 eth)
                      <br></br>
                        <form onSubmit={(e) => {
                          e.preventDefault() //to stop page from refreshing 
                          let amount = this.depositAmount.value
                          amount = amount * 10 * 18 //convert to wei we could also use the web3.utils
                          this.deposit.apply(amount)

                        }}>
                          <div className='form-group mr-sm-2'>
                            <br></br>
                            {/* form to deposit  */}
                            <input
                              id='depositAmount'
                              step="0.01"
                              type='number'
                              className="form-control form-control-md"
                              placeholder='amount...'
                              required
                              ref={(input) => { this.depositAmount = input }}   //keep track of infor user puts in                   
                            />  
                          </div>
                          <button type='submit' className='btn btn-primary'>Deposit</button>
                        </form>
                  </div>
                </Tab>

                   {/* button and form for withdrwa */}
                <Tab eventKey='withdraw' title="Withdraw">
                  <br></br>
                      How much do you want to withdraw + interest? 
                      <br></br>
                      <br></br>
                      <div>
                        <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>Withdraw</button>
                      </div>
            
                </Tab>
               
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;