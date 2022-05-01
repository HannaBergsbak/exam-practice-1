import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";


function FrontPage() {
    return <div>
        <h1>Movie db</h1>
        <ul>
            <li><Link to={"/movies"}>List movies</Link></li>
            <li><Link to={"/movies/new"}>Add movie</Link></li>
        </ul>
    </div>;
}

function ListMovies() {
    return null;
}

function AddNewMovie() {
    return null;
}

function Application() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<FrontPage />} />
                <Route path={"/"} element={<ListMovies />} />
                <Route path={"/"} element={<AddNewMovie />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.render(<Application />, document.getElementById("app"));