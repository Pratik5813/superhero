import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import "./frontend.css"

const divsToUpdate = document.querySelectorAll(".superhero-blocks-to-edit")

divsToUpdate.forEach(function (div) {
  const data = JSON.parse(div.querySelector("pre").innerHTML)
  ReactDOM.render(<Superhero {...data} />, div)
  div.classList.remove("superhero-blocks-to-edit")
})

function Superhero(props) {
  return (
    <div className="card mb-4 text-center m-auto" style={{ width: "18rem" }}>
      <img src={props.heroImage} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title text-center mb-3" style={{ fontSize: "30px" }}>
          {props.heroName}
        </h5>
        <p className="card-text">
          <em>
            <strong>Intelligence : </strong>
          </em>
          {props.intelligence}
        </p>
        <p className="card-text">
          <em>
            <strong>Strength : </strong>
          </em>
          {props.strength}
        </p>
        <p className="card-text">
          <em>
            <strong>Speed : </strong>
          </em>
          {props.speed}
        </p>
        <p className="card-text">
          <em>
            <strong>Real Name : </strong>
          </em>
          {props.fullName}
        </p>
      </div>
    </div>
  )
}
