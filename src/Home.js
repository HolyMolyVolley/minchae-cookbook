import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Home.css";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import "./SlideItem";
// import Swiper core and required modules
import SwiperCore, {
    Pagination,
    Scrollbar
  } from 'swiper';
import SlideItem from "./SlideItem";
import axios from "axios";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

const API_BASE = "http://192.249.18.176:443";

// install Swiper modules 
SwiperCore.use([Pagination]);
SwiperCore.use([Scrollbar]);

export default function Home() {
	const nav = useNavigate();
    const loc = useLocation();
    let nickname = loc.state.nickname;
    
    const { userId } = useParams();
	// const [ recipes, setRecipes ] = useState([]);
	// const [ recipeVersions, setRecipeVersions ] = useState([]);
	const [ searchTerm, setSearchTerm] = useState("");
    const [ recipeList, setRecipeList ] = useState([]);
  	// const [ recipesLoading, setRecipesLoading ] = useState(false);
  	const [ favoriteRecipeList, setFavoriteRecipeList ] = useState([]);

    useEffect(()=> {
		// get every recipe of given userId
        axios.get(`${API_BASE}/recipe/${userId}`).then(res => {
			setFavoriteRecipeList(res.data.map(element => {
				if (element.favorite === true) {
					return (
						<SwiperSlide onClick={() => {
                            console.log(element);
                            nav(`/${element.owner}/${element._id}`, {state: {favorite: element.favorite, owner: element.owner, title: element.title, versions: element.versions, img: element.img, nickname: nickname}});
                            }}>
                            <SlideItem img = {element.img} title = {element.title} />
                        </SwiperSlide>
					);
				}
			}));

            // detail recipe
            Promise.all(res.data.map(recipes => axios.get(`${API_BASE}/recipe/version/${recipes.versions[recipes.versions.length - 1].id}`)))
                .then(re => {
                    setRecipeList(res.data.filter(val => {
                        console.log(val);
                        if(searchTerm == "") {
                            return val;
                        }
                        else if(val.title.toLowerCase().includes(searchTerm.toLowerCase())){
                            return val;
                        }
                    }).map((val, index) => (
                        <div key={index} className = "recipe" onClick={() => {
                            // console.log(val.versions[val.versions.length-1].id);
                            nav(`/${val.owner}/${val._id}`, {state: {favorite: val.favorite, owner: val.owner, title: val.title, versions: val.versions, img: val.img, nickname: nickname}});
                        }}>
                            <div className = "recipe_content">
                                <div className="recipe_body">
                                    <div>{
                                        val.img 
                                            ? <img style={{ width: "200px", height: "200px", borderRadius: "20px", border: "1px solid black"}} src={`${API_BASE}/image/${val.img}`}/>
                                            : <div style={{ width: "200px", height: "200px" }}></div>
                                    }</div>

                                    <div className="recipe_info">
                                        <div className = "recipe_title">
                                            {val.title}
                                        </div>
                                        <div className = "recipe_ingredients">{
                                            re[index].data.ingredients?.map((el,idx) => {
                                                if(idx == re[index].data.ingredients.length - 1 ) {
                                                    return(<div className = "ingredient" key = {idx}> &nbsp;{`${el.name}  ${el.amount}g`} </div>)
                                                } 
                                                else {
                                                    return(<div className = "ingredient"  key = {idx}> &nbsp;{`${el.name}  ${el.amount}g,`} </div>)
                                                }})
                                        }</div> 
                                    </div>
                                </div>
                            </div>
				    	</div>)));
			}).catch(console.log);
        }).catch(console.log);
    }, [searchTerm]);
  
    const onClickHandler = () => {
        if(window.confirm('로그아웃 하시겠습니까?')){
            alert('로그아웃 완료!');
            nav(`/login`);
        }
    }

    return (
        <>
            <div className = "title_bar">
                <div className="infobody">
                    <div className = "title">김민채의 요리보고 조리보고</div>
                    <div className="infobox">
                        <div className = "say_hi">{nickname}님 안녕하세요 :)</div>
                        <div className="logouticon">
                            <LogoutIcon sx={{color: "white"}} onClick={onClickHandler} />
                        </div>
                    </div>
                </div>
            </div>
            <Swiper 
                slidesPerView="auto" 
                slidesOffsetBefore = {50} 
                slidesOffsetAfter = {50} 
                centeredSlides={false} 
                spaceBetween={50} 
                grabCursor={true} 
                pagination={{ "clickable": true }} 
                className="mySwiper">
                {favoriteRecipeList}
            </Swiper>
            <div className = "search">
                <div>
                    <input
                        className="searchInput"
                        type = 'text'
                        placeholder = '🍎 🍓 🍒 🍑 🍅 🍟'
                        onChange={(event)=>{
                            setSearchTerm(event.target.value);
                        }}
                    />
                </div>

            </div>

            <Fab
                event={false}
                mainButtonStyles={{background : "#BF7D7C", fontSize : "10px"} /*mainButtonStyles*/}
                // actionButtonStyles={actionButtonStyles}
                // style={style}
                icon={<AddIcon />}
                // event={event}
                alwaysShowTitle={true}
                onClick={(e) => {
                    e.preventDefault();
                    nav(`/recipe/add/${userId}`, {state: {nickname: nickname}});
                }}
            />

            <div className = "recipe_container">
                {recipeList}
            </div>
        </>
    );

}