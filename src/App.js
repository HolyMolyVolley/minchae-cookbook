import './App.css';
import { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [ src, setSrc ] = useState("");
  // useEffect(() => {
  //   axios.get(`${API_BASE}/recipe`).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }, []);

  const onChange = async (e) => {
    const thumbnail = e.target.files[0];
    const fd = new FormData();
    fd.append('image', thumbnail);

    await axios.post(`${API_BASE}/image`, fd).then(res => {
      setSrc(res.data);
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  };

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
        }).then(console.log);
      }}>login</div>
      <div onClick={(e) => {
        e.preventDefault();
        axios.post(`${API_BASE}/recipe`, {
          owner: "hui0213",
          title: "한우 등심 규카츠",
          favorite: true,
          ver: 1,
          memo: "마시따",
          ingredients: [{ name: "한우", amount: 200 }, { name: "계란", amount: 200 }, { name: "밀가루", amount: 50 }],
          procedure: [
            { index: 1, content: "계란물을 만들어요" }, 
            { index: 2, content: "튀김옷을 입혀요" },
            { index: 3, content: "튀겨요" }
          ]
        }).then(console.log);
      }}>add recipe</div>
      <div onClick={(e) => {
        e.preventDefault();
        axios.get(`${API_BASE}/recipe/hui0213`).then(console.log);
      }}>get recipe</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <input type="file" onChange={onChange} />
        {src === "" ? <></> : <img src={`${API_BASE}/image/${src}`} style={{ width: "100px", height: "100px" }}/>}
      </div>
    </div>
  );
}

export default App;
