import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  // useEffect(() => {
  //   axios.get(`${API_BASE}/recipe`).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }, []);

  return (
    <div className="App">
      <div onClick={(e) => {
        e.preventDefault();
        axios.post(`${API_BASE}/register`, {
          id: "hui0213",
          password: "1234",
          nickname: "hui"
        }).then(console.log);
      }}>register</div>
      <div onClick={(e) => {
        e.preventDefault();
        axios.post(`${API_BASE}/login`, {
          id: "hui0213",
          password: "1234"
        }).then(console.log);;
      }}>login</div>
      <div onClick={(e) => {
        e.preventDefault();
        axios.post(`${API_BASE}/recipe`, {
          owner: "hui0213",
          title: "트러플 된장찌게",
          favorite: false,
          ver: 1,
          memo: "fsadfas",
          ingredients: [{ name: "tofu", amount: 100 }, { name: "호박", amount: 100 }, { name: "된장", amount: 200 }],
          procedure: [{ index: 1, content: "보글보글 끓여요"}, { index: 2, content: "열심히 해봐요"}]
        }).then(console.log);
      }}>recipe</div>
      <div onClick={(e) => {
        e.preventDefault();
        axios.get(`${API_BASE}/recipe/hui0213`).then(console.log);
      }}>get recipe</div>
    </div>
  );
}

export default App;
