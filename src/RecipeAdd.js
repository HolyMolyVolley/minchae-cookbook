import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import ImageUploader from "react-images-upload";
import './RecipeAdd.css'

const API_BASE = 'http://192.249.18.176:443';

export default function RecipeAdd() {
    const { userId } = useParams();
    const [ ingredients, setIngredients ] = useState([]);
    const [ procedures, setProcedures ] = useState([]);
    const [ img, setImg ] = useState("");
    const [ isButtonClicked, setButtonClicked ] = useState(false);
    const ingredientNameRef = useRef();
    const ingredientAmountRef = useRef();
    const procedureRef = useRef();
    const titleRef = useRef();
    const recipememoRef = useRef();

    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        if(loc.state) {
            console.log("edit");
            console.log(loc.state);

            titleRef.current.value = loc.state.title;
            recipememoRef.current.value = loc.state.prev.memo;
            setImg(loc.state.img ? loc.state.img : "");
            setButtonClicked(loc.state.favorite);
            setIngredients(loc.state.prev.ingredients);
            setProcedures(loc.state.prev.procedure.map(e => ({ content: e.content})));
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();  
        if(titleRef.current.value) {
            if(loc.state) {
                axios.post(`${API_BASE}/recipe/version/${loc.state.id}`, {
                    img: img,
                    title: titleRef.current.value,
                    memo: recipememoRef.current.value,
                    favorite: isButtonClicked,
                    ingredients: ingredients,
                    procedure: procedures.map((e, i) => ({
                        index: i + 1,
                        content: e.content
                    }))
                }).then(res => {
                    console.log(res.data);
                    window.alert("저장 완료");
                    nav(`/${userId}/${loc.state.id}`, {state: {favorite: isButtonClicked, owner: userId, title: titleRef.current.value, versions: res.data.versions, img: img}});
                }).catch(console.log);
            }
            else {
                axios.post(`${API_BASE}/recipe`, {
                    img: img,
                    owner: userId,
                    title: titleRef.current.value,
                    memo: recipememoRef.current.value,
                    favorite: isButtonClicked,
                    ingredients: ingredients,
                    procedure: procedures.map((e, i) => ({
                        index: i + 1,
                        content: e.content
                    }))
                }).then(res => {
                    console.log(res.data);
                    window.alert("저장 완료");
                    nav(`/home/${userId}`);
                }).catch(err => {
                    console.log(err);
                    window.alert("실패");
                });
            }
        }
        else {
            window.alert("제목 입력");
        }
    }

    const onIngredientDelete = (e, i) => {
        e.preventDefault();
        setIngredients(ingredients.filter((_, idx) => idx !== i));
    }
    
    const onProcedureDelete = (e, i) => {
        e.preventDefault();
        setProcedures(procedures.filter((_, idx) => idx !== i));
    }

    const onImageChange = async (e) => {
        const thumbnail = e[0];
        const fd = new FormData();
        fd.append('image', thumbnail);

        await axios.post(`${API_BASE}/image`, fd).then(res => {
            console.log(res.data);
            setImg(res.data);
        }).catch(console.log);
    }

    return (
        <div className = "add_body">
            <div className = "container">
                <div className = "container_text">레시피 등록</div>
                <div className = "image_title_memo">
                    <div id = "add_image" className="image_add_container">
                        {
                            img === "" ? <></>
                            :<img src={`${API_BASE}/image/${img}`} style={{ width: "230px", height: "230px" }}/>
                        }
                        <ImageUploader
                            id="image_uploader"
                            withLabel={false}
                            withIcon={false}
                            buttonText="사진 선택"
                            imgExtension={[".png"]}
                            maxFileSize={5242880}
                            singleImage={true}
                            onChange={onImageChange} />
                    </div>
                    <div className = "title_memo">
                        <div className = "title_favorite" style={{ display: "flex"}}>
                            <input id = "input_title" placeholder="제목을 입력하세요" ref={titleRef}></input>
                            {/* <input type="checkbox" ref={favRef}></input> */}
                            <button id = "is_favorite" style = {isButtonClicked? { fontWeight: "900" ,color: 'blue'} : { color:'black'}} onClick = {() => {
                                if(isButtonClicked == false) {
                                    setButtonClicked(true);
                                    document.getElementById("is_favorite").innerText = "★";
                                }
                                else {
                                    setButtonClicked(false);
                                    document.getElementById("is_favorite").innerText = "★";

                                }
                            }}>★</button>
                        </div>
                        <div className = "memo_container">
                            <span id = "text_MEMO">메모</span>
                            <textarea id= "input_memo"placeholder="메모를 입력하세요" ref={recipememoRef}></textarea>
                        </div>
                    </div>
                </div>
                <div className = "ingredients">
                    <div id = "text_INGREDIENTS">재료</div>
                    <div className = "input_wrapper" style={{ display: "flex", flexDirection: "column" , justifyContent: "center"/*,alignItems: "center" */}}>
                        <div className = "input_name_amount">
                            <input id="input_ingredient_name" placeholder="재료 이름" ref={ingredientNameRef}></input>
                            <input id="input_ingredient_amount" type="number" placeholder="중량 (g)" ref={ingredientAmountRef}></input>
                            <div id="ingredient_add_button" style={{ fontSize: "1.5rem", height: "fit-content"}} onClick={(e) => {
                                e.preventDefault();
                                if(ingredientAmountRef.current.value && ingredientNameRef.current.value) {
                                setIngredients(ingredients.concat({ 
                                name: ingredientNameRef.current.value,
                                amount: Number(ingredientAmountRef.current.value)
                                }));
                                ingredientNameRef.current.value = null;
                                ingredientAmountRef.current.value = null;
                                }}}>+</div>
                        </div>
                        <div className="added_ingredients">{
                            ingredients.map((e, i) => 
                                <div className = "item_ingredient" key={i} onClick={(e) => onIngredientDelete(e, i)}>
                                {`${e.name} : ${e.amount}g`}</div>)}
                        </div>
                    </div>
                </div>

                <div className = "procedures">
                    <div id = "text_PROCEDURES">과정</div>

                    <div className = "added_procedures">{
                        procedures.map((e, i)=> 
                        <div className = "item_procedure" onClick={(e) => onProcedureDelete(e, i)} key={i}>
                            <div className= "procedure_index">{`${i+1}`}</div>
                            <div className = "procedure_text">{`${e.content}`}</div>
                            {/* {`${i + 1}: ${e.content}`} */}
                        </div>)
                    }</div>
                    <div id = "input_procedures" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <input id = "input_procedure_text" placeholder="다음 과정을 입력하세요" ref={procedureRef}></input>
                        <div id = "procedure_add_button" style={{ fontSize: "1.5rem" }} onClick={(e) => {
                            e.preventDefault();
                            if(procedureRef.current.value) {
                                setProcedures(procedures.concat({ 
                                    content: procedureRef.current.value
                                }));
                                procedureRef.current.value = null;
                            }
                        }}>+</div>
                    </div>
                </div>
                <div id = "add_button" onClick={onSubmit}>Add recipe</div>
            </div>
        </div>
    );
}