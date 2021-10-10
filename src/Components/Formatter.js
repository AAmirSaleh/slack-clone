import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import imgIcon from './img/link.png';

function Formatter(props){
    //let obj = null;
    const Stack = function() {
        const list = new Array(10);
        let counter = 0;
    
        this.push = function(value) {
            list[counter] = value;
            counter++;
        }
    
        this.pop = function(){
           counter--;
           const retVal = list[counter];
           list[counter] = "";
    
           return retVal;
        }
    
        this.peek = function() {
            return list[counter-1];
        }
    
        this.clear = function() {
            for(let i=0;i<list.length;i++)
                list[i] = "";
        }
    
        this.list = function() {
            console.log("satack:", list);
        }
    }
    
    const stack = new Stack();

    

    const getSelectionDetails = () => {
        const selectedText = textObj.text.substring(textObj.start, textObj.end);
        const textBeforeStartTag = textObj.text.substring(0, textObj.start);
        const textAfterEndTag = textObj.text.substring(textObj.end, textObj.text.length);

        return {selected_text: selectedText, text_before_starting_tag: textBeforeStartTag, text_after_end_tag: textAfterEndTag}
    }

    // function text2html(formattedText) {
       
    //     var content = formattedText;
    //     content = content.replace(/\[b\]/g, "<b>")
    //     content = content.replace(/\[\/b\]/g, "</b>");
    //     //console.log("content:", content);
    //     content = content.replace(/\[i\]/g, "<i>");
    //     content = content.replace(/\[\/i\]/g, "</i>");
    
    //     //console.log(content);
    //     content = content.replace(/\[l\ssrc\=\'(.+)\'\]/g, "<a href='$1'>");
    //     //console.log("after replace: ", content);
    
    //     content = content.replace(/\[\/l\]/g, "</a>");
    
    //     return content;
    
    // }
    

    function boldIt() {

        const txo = props.getTextObj();
       //console.log("txo: ", txo);
        if(txo != null) {
            txo.formatOperation = "B";
        }
        
        setTextObj(txo);   
        // stack.list();
    }

    
    function IIt() {
    
        const txo = props.getTextObj();
        //console.log("txo: ", txo);
        if(txo != null) {
            txo.formatOperation = "I";
        }
    
        setTextObj(txo);
        console.log("textObj: ", textObj)
    }

    function linkIt() {

        const txo = props.getTextObj();
        //console.log("txo: ", txo);
        if(txo != null) {
            txo.formatOperation = "L";
        }
    
        setTextObj(txo);
    
    }

    const [textObj, setTextObj] = useState({text:"", start:0, end:0});

    useEffect( () =>  {

        const textIsSelected = () => {
            return !(textObj.start == textObj.end);
            //return !(obj.start == obj.end);
        }

        console.log("textobj useEffect: ", textObj);
        
        if(!textIsSelected()){
            //alert("no selection!")
            return;
        }

        
        const textSelectionDetails = getSelectionDetails();
        console.log("selection:", textSelectionDetails);

        let replacement=""; 

        if(textObj.formatOperation == 'B'){
            replacement = textSelectionDetails.text_before_starting_tag + "[b]" +
                textSelectionDetails.selected_text + "[/b]"
                + textSelectionDetails.text_after_end_tag;
        }
        else if(textObj.formatOperation == 'I') {
            console.log("IIIIIIII");
            replacement = textSelectionDetails.text_before_starting_tag + "[i]" +
                textSelectionDetails.selected_text + "[/i]"
                + textSelectionDetails.text_after_end_tag;
        }
        else if(textObj.formatOperation == "L") {
            console.log("LLLLLLLLLL"); 
            const link = prompt("URL:", "https://");

            replacement = textSelectionDetails.text_before_starting_tag +
            "[l src='" + link + "']" + textSelectionDetails.selected_text + "[/l]"
                + textSelectionDetails.text_after_end_tag;
            // alert(replacement)
        }
        
        //console.log("replacement:", replacement)
        if(replacement != "")
            console.log("replacement exists")
        else{
            console.log("replacement does not exist");
            return;
        }
            

        const isValid = validateExpression(replacement);
        //console.log("isValid; ", isValid);
        if(isValid){  
           //alert("to setFormattedText(replacemebt)")
            props.setFormattedText(replacement);
        }
        //console.log("textObj> ", textObj);
        //console.log("replacement: ", replacement)

     }, [textObj] )


    function validateExpression(statement) {

        let isValid = true;
        
        for(let i = 0;i<statement.length;i++){
            if(statement[i] == '['){
                if(statement.substring(i, i+3) == '[b]'){
                    stack.push('[b]');
                    //stack.list();
                }
                else if(statement.substring(i, i+3) == '[i]')
                    stack.push('[i]');
                else if(statement.substring(i, i+2) == '[l')
                    findIfAlinkAndPush(statement, i);
                else if(statement.substring(i, i+2) == '[/' && statement.substring(i+3, i+4) == ']'){
                    isValid=popAndValidate(statement, i);
                    console.log("validateExp: ", isValid)
                }
    
            }

            
    
            if(!isValid)
                return false;
        }
    
        isValid = checkNestedTags(statement);
        if(!isValid)
            console.log("nesting error!");
    
        return isValid;
    }

    function findIfAlinkAndPush(statement, index){
        //console.log('index:', index, statement)
        //statement = "[l src='https://www.goo.net']www[/l]"
        //console.log(" substring:", statement.substring(index, statement.length));
        const regex = /\[l\ssrc='.+'\]/g;
        //let match = statement.match(regex);//statement.substring(index, statement.length).match(regex);
        //console.log("index:", index, " match.index:", match.index, "array:", match);
        if(regex.test(statement)) {
            //console.log("There is a link tag")
            stack.push("[l]");
            stack.list();
        } 
    }
    
    function popAndValidate(statement, i){
        const tag = (statement[i] + statement.substring(i+2,i+4));
        // console.log("stack:", stack.list());
        //console.log("tag: ", tag);
        //console.log("statement:", statement);
        let content = stack.pop();
        //console.log('popped: ', content);
    
        if(content){
            //console.log('popped: ', content);
            let content1 = content.replace(/\[([bil])\ssrc\=\'.+\'\]/g, "[$1]");
            //console.log('content after replace: ', content1);
        }
            
        if(content != tag)
            return false;
        return true;
    }
    
    function checkNestedTags(statement) {
        /*
        Invalid nesting :
        [i]xx[i]xx  xx[i]xx[i]xx / :
        will not match:
        [i]xx[/i]xx [i]..
    
        */
        //statement = "xxxc[l xxx]ddd/l][l src]xx"
        
        const invalidNestedI = new RegExp('\\[i\\]((?!\\[\\/i\\]).)*\\[i\\]', 'g')
        const invalidNestedIendTag = new RegExp('\\[\\/i\\]((?!\\[i\\]).)*\\[\\/i\\]', 'g')
        let arr1 = invalidNestedI.exec(statement);
        let arr2 = invalidNestedIendTag.exec(statement);
    
        
        const invalidNestedB = new RegExp('\\[b\\]((?!\\[\\/b\\]).)*\\[b\\]', 'g')
        const invalidNestedBendTag = new RegExp('\\[\\/b\\]((?!\\[b\\]).)*\\[\\/b\\]', 'g')
        let arr3 = invalidNestedB.exec(statement);
        let arr4 = invalidNestedBendTag.exec(statement);
    
        const invalidLinkTg = /\[l\s+(?!src=(?<q>'|").+\k<q>\].+\[\/l\])/g;
        //const invalidNestedLinkEndTag = /\[\/l\](?<!\[l\s*src=(?<q>'|").+\k<q>\])\[\/l\]/g;
        const invalidNestedLinkEndTag = /\[\/l\]((?!\[l.*\]).)*\[\/l\]/g;
        const invalidNestedLinkStartTag = /.*\[l[^\]]*\]((?!\[\/l\]).)*\[l.*\]/g;
        let arr5 = invalidNestedLinkEndTag.exec(statement);
        let arr6 = invalidNestedLinkStartTag.exec(statement);
        console.log("invalid link tag nesting:", arr6);
        console.log("invalid link end tag nesting:", arr5);
    
        // console.log("result", /^\[i\]((?!io).)*d$/g.exec(statement));
        console.log("invalid italic tag nestig", arr1);
        console.log("invalid italic end tag nestig", arr2);
    
        console.log("invalid bold tag nestig", arr3);
        console.log("invalid bold end tag nestig", arr4);
        
        let isValidExpression = !invalidNestedI.test() && !invalidNestedIendTag.test() && 
            !invalidNestedB.test() && !invalidNestedBendTag.test() &&
            !invalidLinkTg.test() && !invalidNestedLinkEndTag.test();
            console.log("is invalid? ", isValidExpression);
        return isValidExpression;
    }
    
    

    return (
        <Icons>
            <div className="format-icons">
                <span onClick={IIt}>
                    <em>I</em>
                </span>&nbsp;&nbsp;
                <span onClick={boldIt}>
                    <b>B</b>
                </span>&nbsp;&nbsp;
                <img src={imgIcon} alt="icon" onClick={linkIt}/>
            </div>&nbsp;&nbsp;
        </Icons>
    )
}

export default Formatter;

const Icons = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;

    div {
        
        display: flex;
        justify-content: center;
        align-items: center;
        
        img {
            width: 13px;
        }

        img:hover {
            cursor: pointer;
        }

        span {
            font-family:"Times New Roman", Times, serif;
        }

        span:hover {
            cursor: pointer;
        }
    }
`;