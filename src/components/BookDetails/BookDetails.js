import React, { useState, useEffect } from 'react';
import './BookDetails.css';
import { useParams, useHistory } from 'react-router-dom';
import SaveBtn from '../SaveBtn/SaveBtn';
import Saved from '../Saved/Saved';
const axios = require('axios');

function BookDetails(props){
  const params = useParams();
  const ISBN = params.book;
  const [bookDisplay, setBookDisplay] = useState(false);
  const [book, setBook] = useState({});
  const [saved, setSaved] = useState(false);


  function getUserID(){
    console.log("getting userID from local storage");
    const localID = JSON.parse( localStorage.getItem("userID") );
    return localID 
  };

  async function getBookData(){
    try {
      const result = await axios.get(`/api/book/${ISBN}`);
      console.log("result", result)
      const book = result.data.book;
      console.log("RESULT", book);
      setBook({
        bookID: book.id ? book.id : null,
        title: book.volumeInfo.title ? book.volumeInfo.title : "",
        subtitle: book.volumeInfo.subtitle ? book.volumeInfo.subtitle : "",
        authors: book.volumeInfo.authors ? book.volumeInfo.authors[0] : "",
        textSnippet: book.searchInfo ? book.searchInfo.textSnippet : "",
        description: book.volumeInfo.description ? book.volumeInfo.description : "", 
        link: book.volumeInfo.infoLink ? book.volumeInfo.infoLink : "",
        image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150",
        isbn: book.volumeInfo.industryIdentifiers ? book.volumeInfo.industryIdentifiers[0].identifier : false
        });
        setBookDisplay(true);
    } catch (err) {
      console.log("ERROR", err)
    };
  };

  async function saveBook(){
    try {
      const userID = await getUserID();
      // eslint-disable-next-line no-unused-vars
      const result = await axios.post(`/api/savebook/${userID}`, book);
    } catch (err) {
        console.log("POST ERROR", err)
    };
  };

  function handleSave(){
    saveBook();
    setSaved(true);
    //props.setNumber(prev => prev + 1)
  };

  let history = useHistory();
  function handleBack(){
    history.goBack();
  };
  
  useEffect( () => {
    getBookData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <>
      { bookDisplay && 
        <div className="book-details-page">
          <button className="backBtn" onClick={handleBack}>Back</button>
          <div className="book-details-container">
            <div className="book-details-image">
              <img src={book.image} alt="book-cover"/>        
            </div>
            <div className="book-details">
              <h2>{book.title}</h2>
              <h3>{book.subtitle}</h3>
              <h4>{book.authors}</h4>
              <p>{book.description}</p> 
              <div className="book-links">
                { !saved ? 
                  <SaveBtn handleSave={handleSave} />
                  :
                  <Saved />
                }
                <a href={book.link} target="_blank" rel="noopener noreferrer">Preview</a>
              </div>    
            </div>
          </div>
        </div>
      }
    </>
  )
};

export default BookDetails;