import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './SearchInput.css';

function HomeInput(props){

  console.log("Render --- SearchINPUT");

  const [inputText, setInputText] = useState("");

  function handleSearch(ev){
    ev.preventDefault();
  };

  function handleInputChange(ev){
    const searchText = ev.target.value.replace(/\s/g, '+');
    setInputText(searchText); 
  };

  function clearForm(){
    const form = document.getElementById('searchInput');
    form.value = "";
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSearch}>
        <input id="searchInput" onChange={handleInputChange} type="text"/>
        <Link to={`/search/${inputText}`} onClick={clearForm}>
          <button>Search</button>
        </Link>
      </form>
    </div>
  )
};

export default React.memo(HomeInput);