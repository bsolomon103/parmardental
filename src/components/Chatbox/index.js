import React, { useState } from "react";
import "./chatbox.css";
import { BsChatRightTextFill } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import ChatboxMessage from "../ChatboxMessage";
import CheckoutButton from '../CheckoutButton'
import ImageUploadForm from '../ImageUpload';
//import Button from '@material-ui/core/Button';

//import fetch from 'node-fetch';

//const URL = "http://localhost:8000/api/response/";
// const URL = "http://127.0.0.1:8000/api/response/";
const URL = "https://api.eazibots.com/api/response/"

function Chatbox({ userName, operatorName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const[sessionKey, setSessionKey] = useState("");
  


  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  //const [csrftoken, setcsrftoken] = useState('');
  function getCookie(name) {
    let cookieValue = "";
    if (document.cookie && document.cookie !== "") {
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (text.trim() === "") {
      return;
    }

    setLoading(true);
    const msg1 = { role: "user", name: userName, message: text };
    setMessages((messages) => [...messages, msg1]);
    setText("");

    const csrftoken = getCookie("csrftoken");
    const sessiontoken = getCookie("sessionid");
    //console.log(csrftoken, ">>>>>>", sessiontoken);

    try {
      const response = await fetch(URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          "X-Session-ID": sessiontoken,
        },
        body: JSON.stringify({ msg: text, session_key:sessionKey }),
        credentials: "include",
      });
      const result = await response.json();
      console.log(result)

      setLoading(false);
      const msg2 = { role: "operator", name: operatorName, message: result['response'] };
      setSessionKey(result['session_key'])
      //console.log(msg2)
      
      //setTimeout(2000)
      setMessages((messages) => [...messages, msg2]);
    } catch (err) {
      setLoading(false);
      console.error("Error:", err);
    }
  };
  return (
    <div className="chatbox">
      <div className={`chatbox__support ${isOpen ? "chatbox--active" : ""}`}>
        <div className="chatbox__header">
          <img
            src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
            alt=""
          />
          <span
            className="chatbox__title"
            style={{ color: "white", font: "4px" }}
          >
            <b>
              Hi, My name is Aurora
              <br />
              <br />
              Ask me anything
            </b>
          </span>
          <button className="chatbox__close" onClick={toggleChatbox}>
            <RiCloseFill size={20} fill="#FFF" />
          </button>
        </div>
        <div className="chatbox__messages">
          {loading && (
            <div className="loading">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
              {loading}
            </div>
          )}
          {messages
            .slice()
            .reverse()
            .map((msg, index) => {
            if (msg['message'].includes('checkout')){
              return (<React.Fragment key={index}>
                        <CheckoutButton sessionKey={sessionKey}/>
                        <ChatboxMessage key={index} msg={msg} sessionKey={sessionKey}/>
                      </React.Fragment>
                );
            }
            if (msg['message'].includes('images')){
              return (<React.Fragment key={index}>
              
                        <ChatboxMessage key={index} msg={msg} sessionKey={sessionKey}/>
                      </React.Fragment>
                );
            }
            else {
              return (
                <ChatboxMessage key={index} msg={msg} sessionKey={sessionKey} />
              );
            }
            })}
        </div>
        <div className="chatbox__footer">
          <div className="chatbox__send">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message...."
            />
            <button className="send__button" onClick={handleSend}>
              <IoMdSend size={30} color="#FFF" />
            </button>
          </div>
          <div className="chatbox__powered">
            Powered By EaziBots{" "}
            <img
              src="https://img.icons8.com/?size=512&id=63766&format=png"
              style={{
                verticalAlign: "middle",
                height: "30px",
                width: "30px",
                marginRight: "5px",
              }}
              alt="globe"
            ></img>
          </div>
        </div>
      </div>
      <div className="chatbox__toggle">
        <button className="chatbox__button" onClick={toggleChatbox}>
          <BsChatRightTextFill size={40} color="#FFF" />
        </button>
      </div>
    </div>
  );
}

export default Chatbox;
