import React, { useState } from 'react';
//import "../utils/css/SearchBarW.css";
import Close from  '../utils/icons/close.svg';
import Magnify from '../utils/icons/magify.svg';
import Link from 'next/link';
import Image from 'next/image';

const SearchBar = ({setToggleSearchBox}) => {

    const [searchTerm, setSearchTerm] = useState('');

    const [searchPlaceHolder, setSearchPlaceHolder] = useState('Search for a Product (i.e. Cameras)');
  
    const selectHandler = (e) => {
      console.log("selectHandler", e.target.value)
      setSearchPlaceHolder(e.target.value)
    }

    const handleonClick = (e) => {
      console.log("toggle staus props",setToggleSearchBox)
      e.stopPropagation();
     setToggleSearchBox && setToggleSearchBox(false)
    }

  
  return (
    <div className="search-page">
        <div className='text-1'>
        <h3>Search By</h3>
        <span onClick={handleonClick}> <Image src={Close} alt="Honeywell close icon" className="close-icon" width={15}/></span>
        </div>

        <div className='search-container'>
        <div className='searchby-dropdown'>
        <select className="select-picker" data-style="btn-primary" onChange={selectHandler}>
            <option value="Search for a Product (i.e. Cameras)">Products</option>
            <option value="Search for a Trending Topic (i.e. Sustainable Buildings)">General Content</option>
            <option default value="Search for a Part Number (i.e. H4L2GR1V)">Part Numbers</option>
          </select>
          <div id="contact_container"></div>
        </div>

        <div className='search-box'>
        <input
          id="search-box"
          type="text"
          className="form-control"
          placeholder={searchPlaceHolder}
          
        />
             <div onClick={() => router.push('/search')} className='search-btn'>
  <Image src={Magnify} alt="search-icon" className='search-icon' />
</div>
        
        </div>
        </div>

    </div>
  );
  


}

export default SearchBar;
