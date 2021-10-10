import React from 'react';
import styled from "styled-components";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
//import { PinDropSharp } from '@material-ui/icons';


function Header({ user, signOut }){
    return (
        <Container>
           <Main>
            <AccessTimeIcon />
                <SearchContainer>
                    <Search>
                        <input type="text" placeholder="Search.." />
                    </Search>
                </SearchContainer>
            <HelpOutlineIcon />
           </Main>
           <UserContainer>
                <Name>
                   {user.name}
                </Name>
                <UserImage>
                    <img src={user.photo ? user.photo : "https://i.imgur.com/6VBx3io.png"} onClick={signOut} alt="alt" />
                </UserImage>
           </UserContainer>
        </Container>
            
    )
}

export default Header

const Container = styled.div`
    background: #350d36;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: inset 0 0 0 1px rgb(104, 74, 104);
`;

const Main = styled.div`
    display:flex;
    margin-left: 16px;
    margin-right: 16px;
`;

const SearchContainer = styled.div`
    min-width: 400px;
    margin-left: 16px;
    margin-right: 16px;
`;

const Search = styled.div`
    box-shadow: inset 0 0 0 1px rgb(104, 74, 104);
    border-radius: 6px;
    width: 100%;
    display: flex;
    align-items: center;

    input {
        background-color: transparent;
        border: none;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        color: white;
    }

    input:focus {
        outline: none;
    }
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    padding-right:16px;
    position: absolute;
    right: 0;
`;

const Name = styled.div`
    padding-right: 16px;
`

const UserImage = styled.div`
    heingt: 28px;
    width: 28px;
    border: 2px solid white;
    border-radius: 3px;
    cursor: pointer;
    
    img {
        width: 100%;
    }
`;