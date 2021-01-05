/* eslint-disable no-unused-vars */
import React, { useEffect, useState} from 'react';
import './HomePage.css';
import HomeInput from '../HomeInput/HomeInput';
import { v4 as uuidv4 } from 'uuid';
import FeaturedBook from '../FeaturedBook/FeaturedBook';
import TopBook from '../TopBook/TopBook';
import NyTimesBook from '../NyTimesBook/NyTimesBook';
const axios = require('axios');

function HomePage(props){
    // book states
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const [nytNonFiction, setNytNonFiction] = useState([]);
    const [t5NonFiction, setT5NonFiction] = useState([]);
    const [nytFiction, setNytFiction] = useState([]);
    const [t5Fiction, setT5Fiction] = useState([]);
    // display states
    const [featuredDisplay, setFeaturedDisplay] = useState(false);
    const [topBooksDisplay, setTopBooksDisplay] = useState(false);
    const [fictionDisplay, setFictionDisplay] = useState(false);
    const [nonFictionDisplay, setNonFictionDisplay] = useState(false);

    async function getFeatured(){
      try {
        const result = await axios.get('/api/featured');
        const resultsList = result.data.data.results.books.slice(0,9);
        setFeaturedBooks( [...resultsList] );
        setFeaturedDisplay(true);
      }
       catch (err) {
        console.log("ERROR", err)
      };
    };

    async function getTopBooks(){
      try {
        const result = await axios.get('/api/topbooks');
        const resultsList = result.data.data;
        setTopBooks([...resultsList]);
        setTopBooksDisplay(true);
      }
       catch (err) {
        console.log("ERROR", err)
      };
    };

    async function getNytNonFiction(){
      try {
        const result = await axios.get('/api/nytnonfiction');
        console.log(result)
        const resultsList = result.data.data.results.books;
        const nytTop5 = resultsList.slice(0,10);
        setNytNonFiction([...resultsList]);
        setT5NonFiction([...nytTop5]);
        setNonFictionDisplay(true);
      } catch (err) {
          console.log("ERROR", err)
      } 
    };
    async function getNytFiction(){
      try {
        const result = await axios.get('/api/nytfiction');
        const resultsList = result.data.data.results.books;
        const nytTop5 = resultsList.slice(0,10);
        setNytFiction([...resultsList]);
        setT5Fiction([...nytTop5]);
        setFictionDisplay(true);
      } catch (err) {
          console.log("ERROR", err)
      }
    };

    // view all button hidden for now

    // function handleDisplayChange(){
    //   setNonFictionDisplay(prev => !prev);
    // };

    function setAPITimeStamp(){
      localStorage.setItem("API_TIMESTAMP", Date.now() );
    };

    function checkAPITimeStamp(){
      console.log("checking time stamp");
      const apiCallTime = localStorage.getItem("API_TIMESTAMP");
      const timeBetween = ( Date.now() - apiCallTime ) / 1000;
      console.log("Time between", timeBetween);
      if ( timeBetween > 20 ){
        console.log("call API");
        setAPITimeStamp();
      } else {
        console.log("Dont call API ")
      }
    };

    useEffect(() => {
      getTopBooks();
      getFeatured();
      getNytNonFiction();
      getNytFiction();
    }, [])

    return ( 
      <div className="home-page">
        <div className="hero-container">
          <div className="headline">
              Find your next great book.
          </div>
          <HomeInput />
        </div>
        { featuredDisplay &&
          <div className="main-content-container">
            <div className="highlighted-books">
              <div className="featured-container">
                <div className="featured-header">
                  <h2>Featured Books</h2>
                </div>
                <div className="featured-flex">
                  { featuredBooks.map( book => 
                    <FeaturedBook 
                      key={uuidv4()}
                      book={book}
                    />
                  )}
                </div>
              </div>
              { topBooksDisplay &&
                <div className="topbooks-container">
                  <h2>Top Books</h2>
                  { topBooks.map( book => 
                    <TopBook
                      key={uuidv4()}
                      book={book.items[0]}
                    />
                  )}
                </div>
              }
            </div>
            { fictionDisplay &&
               <div className="nyt-container-first">
               <h2>NY Times Best Sellers - Fiction</h2>
               {/* <button onClick={handleDisplayChange}>{ !nonFictionDisplay ? "View All" : "View Less" }</button> */}
               <div className="nyt-results top5">
                 { t5Fiction.map( nytbook => 
                   <NyTimesBook 
                     key={uuidv4()}
                     title={nytbook.title}
                     author={nytbook.author}
                     description={nytbook.description}
                     rank={nytbook.rank}
                     weeks={nytbook.weeks_on_list}
                     image={nytbook.book_image}
                     isbn={nytbook.isbns[0].isbn10}
                     isbnP={nytbook.primary_isbn10}
                   />
                 )}
               </div>
              </div>
            }
           { nonFictionDisplay &&
            <div className="nyt-container-second">
              <h2>NY Times Best Sellers - Non-Fiction</h2>
              {/* <button onClick={handleDisplayChange}>{ !nonFictionDisplay ? "View All" : "View Less" }</button> */}
              <div className="nyt-results top5">
                { t5NonFiction.map( nytbook => 
                  <NyTimesBook 
                    key={uuidv4()}
                    title={nytbook.title}
                    author={nytbook.author}
                    description={nytbook.description}
                    rank={nytbook.rank}
                    weeks={nytbook.weeks_on_list}
                    image={nytbook.book_image}
                    isbn={nytbook.isbns[0].isbn10}
                    isbnP={nytbook.primary_isbn10}
                  />
                )}
              </div>
            </div> 
           }
            
          </div> 
        }     
      </div>
    )
};

const memoHomePage = React.memo( HomePage );
export default memoHomePage;
//export default SearchPage;