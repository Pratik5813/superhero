import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import "./frontend.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const divsToUpdate = document.querySelectorAll(".hangman-blocks-to-edit")

divsToUpdate.forEach(function (div) {
    const data = JSON.parse(div.querySelector("pre").innerHTML)
    ReactDOM.render(<Hangman {...data} />, div)
    div.classList.remove("hangman-blocks-to-edit")
})

function Hangman(props) {

    const [wrongAnswer, setWrongAnswer] = useState(0)
    const [correctAnswer, setCorrectAnswer] = useState(0)
    const [clickedLetter, setClickedLetter] = useState("")
    const [correctLetters, setCorrectLetters] = useState([])
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (!props.allowedWrongAnswers) {
        var allowedWrongAnswers = 3
    }
    else {
        allowedWrongAnswers = Number(props.allowedWrongAnswers)
    }


    const description = props.description
    const sponsorMessage = props.sponsorMessage
    const adminInputFormatWord = props.phrase
    const theWord = adminInputFormatWord.join("").toLowerCase()
    const arrayOfTheWord = theWord.split("")
    const uniqueCharsFromTheWord = [...new Set(arrayOfTheWord)]
    const withoutSpace = uniqueCharsFromTheWord.filter((str) => { return /\S/.test(str); })
    const special = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
    const finalWord = withoutSpace.filter((word) => { return !special.test(word) })
    const subBlocks = Object.values(document.getElementsByClassName("hangman-frontend-subblocks"))
    const keyLetters = Object.values(document.getElementsByClassName("key--letter"))

    var game_over = false
    var storedPhrases = localStorage.phrases ? JSON.parse(localStorage.phrases) : new Array()

    var gamesPlayed = localStorage.getItem("gamesPlayed") ? Number(localStorage.getItem("gamesPlayed")) : 0
    var numberOfCorrectAnswers = localStorage.getItem("correctAnswer") ? Number(localStorage.getItem("correctAnswer")) : 0
    var currentStreak = localStorage.getItem("currentStreak") ? Number(localStorage.getItem("currentStreak")) : 0
    var maxStreak = localStorage.getItem("maxStreak") ? Number(localStorage.getItem("maxStreak")) : 0

    useEffect(() => {
        if (clickedLetter.length > 0) {
            if (theWord.includes(clickedLetter) && wrongAnswer <= allowedWrongAnswers) {
                setCorrectAnswer(correctAnswer + 1)
                setCorrectLetters(correctLetters => [...correctLetters, clickedLetter])
            }
            else {
                setWrongAnswer(wrongAnswer + 1)
            }
        }
    }, [clickedLetter])

    document.addEventListener("DOMContentLoaded", () => {
        storedPhrases.forEach((phrase) => {
            for (let index = 0; index < phrase.length; index++) {
                if (phrase[index] == adminInputFormatWord) {
                    const subBlocks = Object.values(document.getElementsByClassName("hangman-frontend-subblocks"))
                    subBlocks.forEach((block) => {
                        if (block.classList.contains("hide")) {
                            block.className = "showLetters"
                        }
                    })
                    const keyLetters = Object.values(document.getElementsByClassName("key--letter"))
                    keyLetters.forEach((letter) => {
                        letter.style.pointerEvents = "none"
                    })
                    const numberofMisses = document.getElementsByClassName("misses-box-number")[0]
                    numberofMisses.innerHTML = 0
                    numberofMisses.parentElement.classList.remove("misses-box-green")
                    numberofMisses.parentElement.classList.add("misses-box-red")
                }
            }
        })

    })


    if (wrongAnswer > allowedWrongAnswers || correctLetters.length == finalWord.length) {
        game_over = true
    }

    if (game_over == true) {
        storedPhrases.push(adminInputFormatWord)
        localStorage.phrases = JSON.stringify(storedPhrases)
        localStorage.setItem("gamesPlayed", gamesPlayed + 0.5)

        if (wrongAnswer > allowedWrongAnswers) {
            if (currentStreak > maxStreak) {
                localStorage.setItem("maxStreak", currentStreak)
            }
            localStorage.setItem("currentStreak", 0)
        }

        if (correctLetters.length == finalWord.length) {

            localStorage.setItem("correctAnswer", numberOfCorrectAnswers + 0.5)
            localStorage.setItem("currentStreak", currentStreak + 0.5)
            if (currentStreak > maxStreak) {
                localStorage.setItem("maxStreak", currentStreak + 0.5)
            }
        }


        if (wrongAnswer > allowedWrongAnswers) {
            subBlocks.forEach((block) => {
                if (block.classList.contains("hide")) {
                    block.className = "showLetters"
                }
            })
            keyLetters.forEach((letter) => {
                letter.style.pointerEvents = "none"
            })
        }
        if (correctLetters.length == finalWord.length) {
            keyLetters.forEach((letter) => {
                letter.style.pointerEvents = "none"
            })
        }
        let currentGamesPlayed = localStorage.getItem("gamesPlayed") ? Number(localStorage.getItem("gamesPlayed")) : 0
        let currentCorrectAnswers = localStorage.getItem("correctAnswer") ? Number(localStorage.getItem("correctAnswer")) : 0
        var winRate = (currentCorrectAnswers / currentGamesPlayed) * 100
        localStorage.setItem("winRate", winRate)
    }


    keyLetters.forEach((letter) => {
        if (letter.classList.contains("clicked")) {
            letter.style.pointerEvents = "none"
        }
    })

    return (
        <>
            {
                wrongAnswer > allowedWrongAnswers ?
                    <>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Oops</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>The word was {props.phrase}</p>
                                {description ?
                                    <>
                                        <h3>Description:</h3>
                                        <p>{description}</p>
                                    </>

                                    : ""}
                                {props.sponsorImage ?
                                    <img src={props.sponsorImage} width="100%" ></img>

                                    : ""}
                                <p>{sponsorMessage}</p>
                            </Modal.Body>
                        </Modal>
                    </>
                    : ""
            }
            {
                correctLetters.length == finalWord.length ?
                    <>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>You got the word!!!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>The word was {props.phrase}</p>
                                {description ?
                                    <>
                                        <h3>Description:</h3>
                                        <p>{description}</p>
                                    </>

                                    : ""}
                                {props.sponsorImage ?
                                    <img src={props.sponsorImage} width="100%" ></img>

                                    : ""}
                                <p>{sponsorMessage}</p>
                            </Modal.Body>
                        </Modal>
                    </>
                    : ""
            }
            <div className="container-fluid">
                <div className="container">
                <div className="row w-100 mb-5 justify-content-between">
                    <a className="custom-link" data-bs-toggle="modal" data-bs-target="#myStats">
                        My Stats
                    </a>
                    <span className={("badge me-lg-5 me-3 ") + (wrongAnswer >= 0.5 * allowedWrongAnswers ? "misses-box-red" : "misses-box-green ")}><span class="misses-box-number">{(allowedWrongAnswers - wrongAnswer > -1 ? allowedWrongAnswers - wrongAnswer : 0)}</span></span>
                </div>
                </div>
            </div>
            <div class="modal fade" id="myStats" tabindex="-1" aria-labelledby="myStatsLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="myStatsLabel">My Stats</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-hover">
                                <tr id="gamesPlayed">
                                    <th>Games Played</th>
                                    <td class="text-end">{localStorage.getItem("gamesPlayed") ? localStorage.getItem("gamesPlayed") : 0}</td>
                                </tr>
                                <tr id="winRate">
                                    <th>Win Rate</th>
                                    <td class="text-end">{localStorage.getItem("winRate") ? localStorage.getItem("winRate") : "0"}</td>
                                </tr>
                                <tr id="currentStreak">
                                    <th>Current Streak</th>
                                    <td class="text-end">{localStorage.getItem("currentStreak") ? localStorage.getItem("currentStreak") : 0}</td>
                                </tr>
                                <tr id="maxStreak">
                                    <th>Max Streak</th>
                                    <td class="text-end">{localStorage.getItem("maxStreak") ? localStorage.getItem("maxStreak") : 0}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="hangman-frontend-block">
                    {adminInputFormatWord.map(function (item, i) {
                        return (
                            <div className='lines'>
                                {item.split(" ").map((word) => {
                                    return (
                                        <div className="word">
                                            {word.split("").map((letter) => {
                                                return (
                                                    <div className={("hide hangman-frontend-subblocks") + (letter == " " || letter.match(special) || correctLetters.includes(letter.toLowerCase()) ? " showLetters" : "")}>
                                                        <span>{letter.toUpperCase()}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })
                    }
                </div>
            </div>

            {props.wordImage ?

                <div className="text-center mb-3">
                    <img src={props.wordImage} height="150px" width="350px" ></img>
                </div>

                : ""
            }

            <div className="keyboard__row">
                <div className="key--letter" dataChar="Q" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>Q</div>
                <div className="key--letter" dataChar="W" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>W</div>
                <div className="key--letter" dataChar="E" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>E</div>
                <div className="key--letter" dataChar="R" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>R</div>
                <div className="key--letter" dataChar="T" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>T</div>
                <div className="key--letter" dataChar="Y" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>Y</div>
                <div className="key--letter" dataChar="U" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>U</div>
                <div className="key--letter" dataChar="I" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>I</div>
                <div className="key--letter" dataChar="O" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>O</div>
                <div className="key--letter" dataChar="P" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>P</div>
            </div>
            <div className="keyboard__row">
                <div className="key--letter" dataChar="A" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>A</div>
                <div className="key--letter" dataChar="S" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>S</div>
                <div className="key--letter" dataChar="D" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>D</div>
                <div className="key--letter" dataChar="F" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>F</div>
                <div className="key--letter" dataChar="G" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>G</div>
                <div className="key--letter" dataChar="H" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>H</div>
                <div className="key--letter" dataChar="J" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>J</div>
                <div className="key--letter" dataChar="K" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>K</div>
                <div className="key--letter" dataChar="L" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>L</div>
            </div>
            <div className="keyboard__row">
                <div className="key--letter" dataChar="Z" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>Z</div>
                <div className="key--letter" dataChar="X" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>X</div>
                <div className="key--letter" dataChar="C" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>C</div>
                <div className="key--letter" dataChar="V" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>V</div>
                <div className="key--letter" dataChar="B" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>B</div>
                <div className="key--letter" dataChar="N" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>N</div>
                <div className="key--letter" dataChar="M" onClick={(e) => {
                    if (!e.target.classList.contains("clicked") && correctLetters.length != finalWord.length) {
                        setClickedLetter(e.target.getAttribute("dataChar").toLowerCase())
                        e.target.classList.add("clicked")
                        if (finalWord.includes(e.target.getAttribute("dataChar").toLowerCase())) {
                            e.target.classList.add("correctClicked")
                        }
                        else {
                            e.target.classList.add("incorrectClicked")
                        }
                    }
                    else {
                        if (e.target.classList.contains("clicked")) {

                        }
                        else if (correctLetters.length == finalWord.length) {
                            alert("You already got it right. No need to play.")
                        }
                    }
                }}>M</div>
            </div>
        </>
    )
}