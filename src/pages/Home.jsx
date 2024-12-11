import React from 'react';
import '../css/Home.css';

const Home = () => {

  return (
    <article>
        <div className="home">
            <div>
                <h1>도서링크 관리자 페이지</h1>
                <img className="search-book-image" 
                        src={"/img/library.png"}
                />
            </div>
        </div>
    </article>
  );
};

export default Home;
