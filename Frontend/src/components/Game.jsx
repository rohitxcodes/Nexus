import React from 'react'
import { Link } from 'react-router-dom';
import Header from "./problem_solving/comp/Header";
import ProblemPage from './problem_solving/pages/ProblemPage';
const Game = () => {
    return (<>
        <Header />
        <ProblemPage />
    </>
    )
}

export default Game