import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Chat from "./Components/Chat";
import Login from "./Components/Login";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import db, { auth } from './firebase';
import './App.css';
//import { getContrastRatio } from '@material-ui/core';
import { useEffect, useState } from 'react';
//import { AirlineSeatLegroomExtraSharp } from '@material-ui/icons';

function App() {
  const [rooms, setRooms] = useState([]);
  const [user, setUser ] = useState(JSON.parse(localStorage.getItem("user")));

  

  const signOut = () => {
    console.log("to sign out,")
    auth.signOut().then(
      () => {
        localStorage.removeItem('user');
        setUser(null);
        //window.location.assign('https://accounts.google.com/logout');
      }
    )
  }

  useEffect(() => {
    const getChannels= () => {
      db.collection('rooms').onSnapshot((snapshot) => {
        
        setRooms(snapshot.docs.map((doc) => {
          //console.log("rooms::", snapshot.docs.length)
          // console.log("rooms:", rooms)
          return {id: doc.id, name: doc.data().name}
          
        }))
      });
    }

    getChannels();
  }, []);

  console.log("User in App state: ", user);
  return (
    <div className="App">
      <Router>
        {
          !user ?
          <Login setUser = {setUser} />
          :
        <Container>
          <Header user={user} signOut={signOut} />
            <Main>
              <Sidebar rooms = {rooms} />
              <Switch>
                <Route path="/room/:channelId">
                  <Chat user = {user} />
                </Route>
                <Route path="/">
                  Select or Create a Channel!
                </Route>
              </Switch>
            </Main>
          
        </Container>
        }
      </Router>
    </div>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 38px minmax(0, 1fr);
`
const Main = styled.div `
  display: grid;
  grid-template-columns: 260px auto;
`