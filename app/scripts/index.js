// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

import 'bootstrap/dist/css/bootstrap.css'
// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import lakeLifeArtifact from '../../build/contracts/LakeLifeContract.json'

// lakeLife is our usable abstraction, which we'll use through the code below.
const lakeLife = contract(lakeLifeArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the LakeLife abstraction for Use.
    // setting up contract providers and transaction defaults for ALL contract instances
    lakeLife.setProvider(web3.currentProvider)
    //lakeLife.defaults({from: web3.eth.accounts[0],gas:6721975})

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.refreshNumberOfLakeRecords()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshNumberOfLakeRecords: function() {
    const self = this

    let recordNum
    lakeLife.deployed().then(function(instance) {
      recordNum = instance
      return recordNum.getLakeRecordNum.call({ from: account })
    }).then(function (value) {
      const numOfRecords = document.getElementById('records')
      numOfRecords.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting number of lake records; see log.')
    })
  },

  getLakeRecords: function() {
    const self = this

    const id = document.getElementById('id2').value;

    this.setStatus('Fetching Lake Record... (please wait)')

    let response
    lakeLife.deployed().then(function (instance) {
      response = instance
      //return response.getLakeRecord.call(id, { from: account });
      return response.getLakeRecord(id, { from: account });
    }).then(function (value) {
      console.log(value); // should be an array
//      const lname = document.getElementById('name2')
//      lname.innerHTML = value.valueOf()

//      const laddress = document.getElementById('address2')
//     laddress.innerHTML = value[1].valueOf()

/*     const larea = document.getElementById('area2')
      larea.innerHTML = value[0].toNumber()

      const lcapacity = document.getElementById('capacity2')
      lcapacity.innerHTML = value[1].valueOf()

      const ldepth = document.getElementById('depth2')
      ldepth.innerHTML = value[2].valueOf()
*/
      self.setStatus('Lake Record Fetched!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting lake records; see log.')
    })
  },

  submitLakeRecords: function() {
    const self = this

    var id = document.getElementById('id').value
//    var name = document.getElementById('name').value
    //var address = document.getElementById('address').value
    var area = document.getElementById('area').value
    var capacity = document.getElementById('capacity').value
    var depth = document.getElementById('depth').value

    this.setStatus('Submitting Lake Record... (please wait)')

    let submit
    lakeLife.deployed().then(function (instance) {
      submit = instance
      return submit.newLakeRecord(id, area, capacity, depth, { from:account })
    }).then(function () {
      self.setStatus('Lake Record Submitted!')
      self.refreshNumberOfLakeRecords()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error submitting lake record; see log.')
    })
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:8545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
