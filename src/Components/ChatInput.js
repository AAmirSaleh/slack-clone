import React, { useRef, useState } from 'react';
import styled from "styled-components";
import SendIcon from '@material-ui/icons/Send';
import Formatter from './Formatter';


function ChatInput({sendMessage}) {

    const [input, setInput] = useState("");
    const inputEl = useRef(null);

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
            console.log("text selected:", text);
        } else if (document.selection && document.selection.type !== "Control") {
            text = document.selection.createRange().text;
            console.log("text selected:", text);
        }
        return text;
    }

    const send = (e) => {
        e.preventDefault();
        if(!input) return;

        sendMessage(input);
        setInput("");
        //inputEl.current.value="ref works!";
    }

    const getFormattedText = (textFormatted) => {
        //alert(textFormatted);
        setInput(textFormatted);
    }

    const createAndSendTxtObj = () => {
    
        const selectedBoundries = getSelectedStartAndEnd();
        if(selectedBoundries == null)
            return null;
        return {text: input, start : selectedBoundries.start, end: selectedBoundries.end};

    }

    const getSelectedStartAndEnd = () => {

        if(inputEl.current == null){
            return null;
        }
        else {
            console.log("inputEl-->", inputEl);
            const start = inputEl.current.selectionStart;
            const end = inputEl.current.selectionEnd;
            return {formatOperation:"", start: start, end: end};
        }
        //console.log(start, ", ", end)

        //return null;
    }

    return (
        <Container>
           <InputContainer>
                <form>
                    {/* <div><div><span><em>I</em></span>&nbsp;&nbsp;<span><b>B</b>
                    </span>&nbsp;<img src={imgIcon}
                    alt="icon" /></div>&nbsp;&nbsp;</div> */}
                    <Formatter setFormattedText={getFormattedText} getTextObj = {createAndSendTxtObj} />
                    <input ref={inputEl} type="text" placeholder="Message here..." value = {input} onChange = {(e) => setInput(e.target.value)} onMouseUp={getSelectionText}/>
                    <SendButton type='submit'  onClick={send}>
                        <Send />
                    </SendButton>
                </form>
                
           </InputContainer>
        </Container>
    )
}

export default ChatInput;

const Container = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 24px;
    
`;

const InputContainer= styled.div`
    border: solid 1px #8D8D8E;
    border-radius: 4px;

    form {
        display: flex;
        height: 42px;
        align-items: center;
        padding-left: 10px;

        input {
            flex:1;
            border: none;
            font-size: 13px;
        }

        input:focus {
            outline:none;
        }
    }
`;

const SendButton = styled.button`
    background-color: #007a5a;
    border-radius: 2px;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
    cursor: pointer;
    border: none;

    .MuiSvgIcon-root {
        width: 18px;
    }

    :hover {
        background: #148567;
    }
`;

const Send=styled(SendIcon)`
    color: #D9D9D9
`;