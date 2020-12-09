import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from "react";
import PatentAgencyABI from "./PatentAgencyABI";


function App() {

  const [contract, setContract] = useState();
  const [loaded, setLoaded] = useState(false);
  const [notReviewedPatents, setNotReviewedPatents] = useState([]);
  const [reviewedPatents, setReviewedPatents] = useState([]);
  const [inventorName, setInventorName] = useState("");
  const [applicantsName, setApplicantsName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [registrationAddress, setRegistrationAdress] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [country, setCountry] = useState("");
  const [uid, setUid] = useState(0);
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [patentNumber, setPatentNumber] = useState(0);
  const [decisionNumber, setDecisionNumber] = useState(0);
  const [decisionDate, setDecisionDate] = useState(0);
  const [lawNumber, setLawNumber] = useState(0);
  const [internationalClassificationNumber, setInternationalClassificationNumber] = useState(0);
  const [transferTo, setTransferTo] = useState("");

  const loadDep = async () => {
    const isOk = await loadWeb3();
    if (isOk === "Ok"){
      await loadContract();
      // await loadPatents();
      setLoaded(true);
    }
  }

  useEffect(() => {
    loadDep();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      contract.methods.getPatents().call().then(patents => {
        console.log(patents); 
        const nap = patents.filter(patent => "0" === patent.state)
        setNotReviewedPatents(nap);
        const ap = patents.filter(patent => ["1", "2", "3"].includes(patent.state))
        setReviewedPatents(ap)
      })
    }, 5000)

    return () => {
        clearInterval(intervalId);
    }

  }, [contract]);


  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = await new Web3(window.ethereum);
      window.ethereum.enable();
      return "Ok";
    }
    return "Not ok";
  }
  const loadContract = async () => {
    const contract = await new window.web3.eth.Contract(PatentAgencyABI, "0x1Dd9E27D49e5B4048298b5B0f98f044e7455bfe7");
    setContract(contract);
  }

  const onChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name === "inventorName") setInventorName(value);
    if(name === "applicantsName") setApplicantsName(value);
    if(name === "agentName") setAgentName(value);
    if(name === "registrationAddress") setRegistrationAdress(value);
    if(name === "title") setTitle(value);
    if(name === "link") setLink(value);
    if(name === "country") setCountry(value);
    if(name === "uid") setUid(value);
    if(name === "responsiblePerson") setResponsiblePerson(value);
    if(name === "patentNumber") setPatentNumber(value);
    if(name === "decisionNumber") setDecisionNumber(value);
    if(name === "decisionDate") setDecisionDate(value);
    if(name === "lawNumber") setLawNumber(value);
    if(name === "internationalClassificationNumber") setInternationalClassificationNumber(value);
    if(name === "transferTo") setTransferTo(value);
  }
  const createPatent = async () => {
    const accounts = await window.web3.eth.getAccounts();
    await contract.methods.createPatent(accounts[0], inventorName, applicantsName, agentName, registrationAddress, title, link, country).send({from: accounts[0]});
  }
  const acceptPatent = async () => {
    const accounts = await window.web3.eth.getAccounts();
    console.log(decisionDate);
    await contract.methods.acceptPatent(uid, decisionNumber, decisionDate, responsiblePerson, patentNumber, lawNumber, internationalClassificationNumber).send({from: accounts[0]});
  }
  const declinePatent = async () => {
    const accounts = await window.web3.eth.getAccounts();
    await contract.methods.declinePatent(uid, decisionNumber, decisionDate, responsiblePerson).send({from: accounts[0]});
  }
  const transferPatent = async () => {
    const accounts = await window.web3.eth.getAccounts();
    await contract.methods.transferOwnership(uid,transferTo).send({from: accounts[0]});
  }
  const onSubmitCreation = (event) => {
    event.preventDefault();
    createPatent().then(() => console.log("ok"));
  }
  const onSubmitAcception = (event) => {
    event.preventDefault();
    acceptPatent().then(() => console.log("ok")).catch(() => alert("You can not do it"));
  }
  const onSubmitDecline = (event) => {
    event.preventDefault();
    declinePatent().then(() => console.log("ok")).catch(() => alert("You can not do it"));
  }
  const onSubmitTransfer = (event) => {
    event.preventDefault();
    transferPatent().then(() => console.log("ok"))//.catch(() => alert("You can not do it"));
  }
  return (
    <div className="App">
      { !loaded && <p>You should install MetaMask, and rigister on it</p> }
      <h1>Patent Agency</h1>
      <h2>Create Patent</h2>
      <form onSubmit={onSubmitCreation}>
        <label>
          Inventor name:
          <input type="text" value={inventorName} onChange={onChange} name="inventorName"/>
        </label> <br />
        <label>
          Applicants name:
          <input type="text" value={applicantsName} onChange={onChange} name="applicantsName"/>
        </label> <br />
        <label>
          Agent name:
          <input type="text" value={agentName} onChange={onChange} name="agentName"/>
        </label> <br />
        <label>
          Registration Address:
          <input type="text" value={registrationAddress} onChange={onChange} name="registrationAddress"/>
        </label> <br />
        <label>
          Title:
          <input type="text" value={title} onChange={onChange} name="title"/>
        </label> <br />
        <label>
          Link:
          <input type="text" value={link} onChange={onChange} name="link"/>
        </label> <br />
        <label>
          Country:
          <input type="text" value={country} onChange={onChange} name="country"/>
        </label> <br />
        <input type="submit"/>
      </form>

      <h2>Not reviewed patents</h2>

      <table >
        <thead>
          <tr>
            <th>Uid</th>
            <th>Title</th>
            <th>Owner</th>
            <th>Inventor</th>
            <th>Agent Name</th>
            <th>Applicant's Name</th>
            <th>Link</th>
            <th>Country</th>
            <th>Registration Address</th>  
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {notReviewedPatents.map(patent => {
            return <tr>
              <td>{patent.uid}</td>
              <td>{patent.title}</td>
              <td>{patent.owner}</td>
              <td>{patent.inventor}</td>
              <td>{patent.agentName}</td>
              <td>{patent.applicantsName}</td>
              <td><a href={patent.link} >{patent.link}</a></td>
              <td>{patent.country}</td>
              <td>{patent.registrationAddress}</td>
              <td>{["Created", "Accepted", "Declined", "Expired"][patent.state]}</td>
            </tr>
          })}
        </tbody>
      </table>

      <h2>Accept form</h2>
      <form onSubmit={onSubmitAcception}>
        <label>
          Uid:
          <input type="number" value={uid} onChange={onChange} name="uid"/>
        </label> <br />
        <label>
          Patent Number:
          <input type="number" value={patentNumber} onChange={onChange} name="patentNumber"/>
        </label> <br />
        <label>
          Decision Number:
          <input type="number" value={decisionNumber} onChange={onChange} name="decisionNumber"/>
        </label> <br />
        <label>
          Decision Date:
          <input type="date" value={decisionDate} onChange={onChange} name="decisionDate"/>
        </label> <br />
        <label>
          Law number:
          <input type="number" value={lawNumber} onChange={onChange} name="lawNumber"/>
        </label> <br />
        <label>
          International Classification Number:
          <input type="number" value={internationalClassificationNumber} onChange={onChange} name="internationalClassificationNumber"/>
        </label> <br />
        <label>
          Responsible person:
          <input type="text" value={responsiblePerson} onChange={onChange} name="responsiblePerson"/>
        </label> <br />
        <input type="submit"/>
      </form>

      <h2>Decline Form</h2>
      <form onSubmit={onSubmitDecline}>
        <label>
          Uid:
          <input type="number" value={uid} onChange={onChange} name="uid"/>
        </label> <br />
        <label>
          Decision Number:
          <input type="number" value={decisionNumber} onChange={onChange} name="decisionNumber"/>
        </label> <br />
        <label>
          Decision Date:
          <input type="date" value={decisionDate} onChange={onChange} name="decisionDate"/>
        </label> <br />
        <label>
          Responsible person:
          <input type="text" value={responsiblePerson} onChange={onChange} name="responsiblePerson"/>
        </label> <br />
        <input type="submit"/>
      </form>

      <h2>Reviewed patents</h2>
      <table >
        <thead>
          <tr>
            <th>Uid</th>
            <th>Title</th>
            <th>Owner</th>
            <th>Inventor</th>
            <th>Agent Name</th>
            <th>Applicant's Name</th>
            <th>Link</th>
            <th>Country</th>
            <th>Registration Address</th>  
            <th>Patent Number</th>
            <th>Decision Number</th>
            <th>Decision Date</th>
            <th>Law Number</th>
            <th>International Classification Number</th>
            <th>Responsible Person</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {reviewedPatents.map(patent => {
            return <tr>
              <td>{patent.uid}</td>
              <td>{patent.title}</td>
              <td>{patent.owner}</td>
              <td>{patent.inventor}</td>
              <td>{patent.agentName}</td>
              <td>{patent.applicantsName}</td>
              <td><a href={patent.link} >{patent.link}</a></td>
              <td>{patent.country}</td>
              <td>{patent.registrationAddress}</td>
              <td>{patent.patentNumber}</td>
              <td>{patent.decisionNumber}</td>
              <td>{patent.decisionDate}</td>
              <td>{patent.lawNumber}</td>
              <td>{patent.internationalClassificationNumber}</td>
              <td>{patent.responsiblePerson}</td>
              <td>{["Created", "Accepted", "Declined", "Expired"][patent.state]}</td>
            </tr>
          })}
        </tbody>
      </table>


      <h2>Transfer form</h2>
      <form onSubmit={onSubmitTransfer}>
        <label>
          Uid:
          <input type="number" value={uid} onChange={onChange} name="uid"/>
        </label> <br />
        <label>
          Account address:
          <input type="text" value={transferTo} onChange={onChange} name="transferTo"/>
        </label> <br />
        <input type="submit"/>
      </form>


    </div>
  );
}

export default App;
