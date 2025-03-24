import React from 'react'
import "../styles/Card.css"

const Card = ({name,img,onClick}) => {
  return (
    <div className="card"  onClick={onClick}>
        <img src={img} alt=""  style={{height:"230px",width:"230px"}}/>
        <h3 className="pokemon-name">{name}</h3>
    </div>
  )
}

export default Card