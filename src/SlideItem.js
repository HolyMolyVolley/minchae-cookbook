import { Component } from "react";

const API_BASE = "http://192.249.18.176:443"

class SlideItem extends Component {
    render () {
        
        return (
            <div class = "slide_item">
                {
                    this.props.img ? <img className="favorite_image" style={{ width: "150px", height: "150px" }} src={`${API_BASE}/image/${this.props.img}`} /> : <></>
                }
                <p class = "favorite_recipe_title">{this.props.title}</p>
            </div>
        );
    }
}

export default SlideItem;