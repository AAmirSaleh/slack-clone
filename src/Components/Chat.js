import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
//import { Info } from '@material-ui/icons';
import ChatInput from "./ChatInput";
import ChatMessage from './ChatMessage';
import db from "../firebase";
import { useParams } from 'react-router-dom';
import firebase from "firebase";

function Chat( {user}){

    let {channelId} = useParams();
    const [ channel, setChannel] = useState();
    const [messages, setMessages] = useState([]);  

    

    const sendMessage = (text) => {
        if(channelId) {
            let payload = {
                text : text,
                user: user.name,
                userImage: user.photo,
                timestamp: firebase.firestore.Timestamp.now(),
            }

            db.collection("rooms").doc(channelId).collection("messages").add(payload);
            //console.log(payload);
        }
    }

    useEffect(() => {
        const getChannel = () => {
            db.collection('rooms')
            .doc(channelId)
            .onSnapshot((snapshot) => {
                //console.log("data for ch,:", snapshot.data());
                setChannel(snapshot.data().name);
                // console.log("channel: ", channel);
            })
        }

        const getMessages= () => {
            db.collection('rooms')
            .doc(channelId)
            .collection("messages")
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                //console.log(snapshot.data());
                let messages = snapshot.docs.map((doc) => doc.data());
                setMessages(messages);
            })
        }

        getChannel();
        //console.log(messages);
        getMessages();
    }, [channelId])

    const messageToHtml = (message) => {
        var content = message;
        content = content.replace(/\[b\]/g, "<b>")
        content = content.replace(/\[\/b\]/g, "</b>");
        //console.log("content:", content);
        content = content.replace(/\[i\]/g, "<i>");
        content = content.replace(/\[\/i\]/g, "</i>");
    
        //console.log(content);
        content = content.replace(/\[l\ssrc\=\'(.+)\'\]/g, "<a href='$1'>");
        //console.log("after replace: ", content);
    
        content = content.replace(/\[\/l\]/g, "</a>");
    
        return content;
    }

    return (
        <Container>
            <Header>
                <Channel>
                    <ChannelName>
                        {channel}
                        {/* # {channel.name} */}
                    </ChannelName>
                    <ChannelInfo>
                        Company-wide annoucements and work matters
                    </ChannelInfo>
                </Channel>
                <ChannelDetails>
                    <div>
                        Details
                    </div>
                    <Info />
                </ChannelDetails>
            </Header>
            <MessageContainer>
                {
                    messages.length > 0 && messages.map((data, index) => (
                        <ChatMessage 
                            text = {messageToHtml(data.text)}
                            name = {data.user}
                            image = {data.userImage}
                            timestamp = {data.timestamp}
                        />
                    ))
                }
            </MessageContainer>
            <ChatInput sendMessage = {sendMessage} />
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: grid;
    grid-template-rows : 64px auto min-content;
    min-height : 0;
`;

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const Header = styled.div`
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    align-items: center;
    border-bottom: 1px solid rgb(83, 39, 38, .13);
    justify-content: space-between;
`;

//const ChatInput = styled.div``;

const Channel = styled.div``;

const ChannelDetails = styled.div`
    display: flex;
    aign-items: center;
    color: #606060;
`;

const ChannelName = styled.div`
    font-weight: 700;
`;

const ChannelInfo = styled.div`
    font-weight: 400;
    color: #606060;
    font-size: 13px;
    margin-top:8px;

`;

const Info = styled(InfoOutlinedIcon)`
    margin-left: 10px;  
`;
    
