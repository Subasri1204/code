import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Print from "../utils/icons/print.svg";
import Save from "../utils/icons/save.svg";
import Minus from "../utils/icons/minus.svg";
import Plus from "../utils/icons/plus.svg";
import Success from "../utils/icons/success.svg";
import Danger from "../utils/icons/danger.svg";
import CaratRight from "../utils/icons/caratright.svg";
import CaratLeft from "../utils/icons/caratright.svg";
//import '../utils/css/pdp.css';
import Link from 'next/link';
import Image from 'next/image';
//import usePdpApiCall from '../customHook/usePdpApiCall';
//import  {productdetailApi,productpriceApi} from '../utils/ApiList/axiosapi.js';

import useDownloader from '../customHook/useDownloader';
import useBynderPdf from "../customHook/useBynderPdf";

const Pip = ({data,price,avail}) => {

  //const Pdp = () => {
    
    const [activeTab, setActiveTab] = useState('Overview');
    const [quantity, setQuantity] = useState(1);
    //const [product, setProduct] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

  //const data = usePdpApiCall(productdetailApi,productpriceApi);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Now you can safely access localStorage
      const loggedIn = localStorage.getItem('userLoggedIn') === "true";
      setUserLoggedIn(loggedIn);
    }
  }, []);

   const bynderPdf = useBynderPdf();
  
  if(!data) return null;
  if(!price) return null;
  if(!avail) return null;

  console.log("price from pdpcomponent", price);
  console.log("avail from pdpcomponent", avail); 
  console.log("data from pdpcomponent", data);
  console.log("price from pdpcomponent", price);

  const specifications = data.pdpData?.classifications;
  const description = data.pdpData?.description;
  const resources = data.pdpData?.media;
  const productimg = data.pdpData?.images;

  const listPrice = price?.pdpData?.price?.listPrice;
  const yourPrice = price?.pdpData?.price?.netPrice;
  const uom = price?.pdpData?.price?.salesUOM;
  const discount = price?.pdpData?.price?.discount;

  
  const quant = avail?.pdpData?.availableDates && avail?.pdpData?.availableDates[0]?.quantity;
  const date = avail?.pdpData?.availableDates && avail?.pdpData?.availableDates[0]?.availableDate;
  const color = avail?.pdpData?.availableDates && avail?.pdpData?.availableDates[0]?.color;

  //const bynderPdf = useBynderPdf();
  console.log("bynderpdf",bynderPdf?.bynderPdf?.s3_file);

  const authenticatedDownload = (endpoint,name)=>{
    if(localStorage.getItem('userLoggedIn') === "true"){
      
      pdfDownloadDummy(endpoint,name);
      
    } else{
    alert("user not logged in");
    }
  }

  const pdfDownloadDummy = (_url, filename) => {
   // useDownloader(_url, filename);
    console.log("pdfdownload", _url);
    const link = document.createElement('a');
    link.href = _url;
    link.target = '_blank';
    link.download = filename // Optional: Sets the file name based on the URL
    link.click();
  };

  
  const pdfDownload = (_url, filename) => {
    // useDownloader(_url, filename);
     console.log("pdfdownload", _url);
     const link = document.createElement('a');
     link.href = _url;
     link.target = '_blank';
     link.download = filename // Optional: Sets the file name based on the URL
     link.click();
   };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const items = [
    {
      src: require("../utils/images/image.png"),
      text: "583413",
      text2: "Cable set for connecting the batteries to the Comprio",
    },
    {
      src: require("../utils/images/image.png"),
      text: "XAL-53",
      text2: "hazardous Location Pull Station, N/O and N/C Contacts",
    },
    {
      src: require("../utils/images/image.png"),
      text: "P2RL",
      text2: "Horn Strobe, 2-wire, Indoor, Wall, Red, Marked FIRE",
    },
    {
      src: require("../utils/images/image.png"),
      text: "FSP-951-IV",
      text2: "Photoelectric Smoke Detector, RSP-951 Series, 32 to 120F, Ivory",
    },
    {
      src: require("../utils/images/image.png"),
      text: "Smoke Detector",
      text2: "Early warning detecor, buisness critical environments, 500 m2",
    },
    {
      src: require("../utils/images/image.png"),
      text: "Stopper Dome",
      text2:
        "Smoke bubble, 60 Series mounts, installation options, 60 Series IP cameras",
    },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleItems = [];
  for (let i = 0; i < 4; i++) {
    visibleItems.push(items[(currentIndex + i) % items.length]);
  }

  return (
    <div className="BEAMHK-Product">
      <div className="top-beamhk">
        <div className="products-title-info-pip">
          {productimg && <h1>{productimg[0]?.altText}</h1>}
          <p>Heater Kit for Beam detector</p>
        </div>

        <div className="print-section">
          <nav className="print-nav">
            <ul className="print-nav-items">
              <li>
                <a href="https://buildings.honeywell.com/us/en/ecommerce">
                  <Image
                    src={Print}
                    alt="Honeywell print icon"
                    className="print-icon-1"
                  />
                  <span className="print-W">Print With Price</span>
                </a>
              </li>
              <li>
                <a href="https://buildings.honeywell.com/us/en/ecommerce">
                  <Image
                    src={Print}
                    alt="Honeywell print icon"
                    className="print-icon-2"
                  />
                  <span className="print-WO">Print Without Price</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="middle-beamhk">
        <div className="image-side-pip">
          {productimg && (
            <div className="images-pip">
              <img src={productimg[1].url} className="beamhk-image-2" />
              <img
                src={productimg[1].url}
                alt={productimg[1].altText}
                className="beamhk-image-1"
              />
            </div>
          )}
          <div className="add-to-cart-section">
            <div className="save-icon-box">
              <Image src={Save} alt="Honeywell save icon" className="save-icon" />
            </div>
            <div className="add-to-cart-button">
              <p className="add-to-cart-link">ADD TO CART</p>
            </div>
          </div>

          <div className="compare-checkbox-section">
            <input type="checkbox" className="compare-checkbox" />
            <label className="checkbox-label">Compare</label>
          </div>
        </div>

        <div className="product-info-side-pip">
          <nav className="product-navbar-pip">
            <ul className="product-nav-items-pip">
              <li
                className={activeTab === "Overview" ? "active" : ""}
                onClick={() => handleTabClick("Overview")}
              >
                Overview
              </li>
              <li
                className={activeTab === "Specifications" ? "active" : ""}
                onClick={() => handleTabClick("Specifications")}
              >
                Specifications
              </li>
              <li
                className={activeTab === "Resources" ? "active" : ""}
                onClick={() => handleTabClick("Resources")}
              >
                Resources
              </li>
              <li>Training</li>
              <li>Replacement Products</li>
            </ul>
          </nav>

          <div className="product-content-pip">
            {activeTab === "Overview" && description && (
              <div className="product-overview">
                <p className="product-desc-title-pip">Product Description</p>
                <p className="product-desc-info-pip" dangerouslySetInnerHTML={{ __html: description }}  />
                <p className="feats-and-benefits-title-pip">Features & Ben*</p>
                <div className="second-level-pip">
                  <p>List Price</p>
                  <p>Your Price</p>
                  <p>UoM</p>
                  <p>Quantity</p>
                  <p>Subtotal</p>
                </div>

                <div className="third-level-pip">
                  {listPrice && <p className="crossed-line-price-pip">USD {listPrice}</p>}
              { yourPrice &&   <p>
                    USD {yourPrice}{" "}
                    
                   <span className='discount-text'>{`(${discount}% Discount)`}</span>
                  </p>}
                  {uom && <p>{uom}</p>}
                  <p className="quantity-box">
                    <Image
                      src={Minus}
                      alt="Minus"
                      onClick={handleDecrease}
                      className="quantity-icon"
                    />
                   {quantity}
                    <Image
                      src={Plus}
                      alt="Plus"
                      onClick={handleIncrease}
                      className="quantity-icon"
                    />
                  </p>
                  {yourPrice && <p>USD {yourPrice * quantity}</p>}
                </div>

                <div className="fourth-level">
                  <div className="amount-section">
                   {quant && date && <p className="amount-available-text">
                      <Image
                        src={color === "Green" ? Success : Danger}
              
                        alt="Honeywell success icon"
                        className="success-icon"
                      />
                    { ` ${quant} Available on ${date}` }
                    </p>}
                  </div>
                  <p className="product-availability-text">
                    Product availabilty is estimated on current stock level,
                    which may be different at time of order processing. No
                    reservation has been performed at this time. Delivery Dates
                    will be advised after order is processed.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "Specifications" && specifications && (
              <div className="product-specifications">
                <table className="specifications-table">
                  {specifications.map((specification, index) => (
                    <tr key={index} className="table-rows">
                      <td className="table-headers">{specification.code}</td>
                      <td>{specification.value}</td>
                    </tr>
                  ))}
                </table>
              </div>
            )}
            {activeTab === "Resources" && resources && (
              <div className="product-resources">
                <table className="resources-table">
                  <tr className="resources-table-rows">
                    <td className="resources-table-headers">Name</td>
                    <td className="resources-table-headers">URL</td>
                  </tr>
                  {resources.map((resource, index) => (
    <tr key={index}>
        <td>{resource.resourceName}</td>
        <td>
           
                <Link 
                    onClick={() => pdfDownload(resource.externalLink, resource.resourceName)} 
                    href={resource.externalLink} 
                    className='download-link'
                >
                    Download
                </Link>       
                 
        </td>
    </tr>
))}
{/*<td>Dummy Cloudinary Pdf</td>
<td>
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault(); // Prevent the default link behavior
      pdfDownloadDummy(
        "https://res.cloudinary.com/dz8qhefe6/image/upload/v1721397461/202-LS-014-2020.pdf",
        "demo_cloudinary"
      );
    }}
    className="download-link"
  >
    Download
  </a>
</td>*/}
<tr>
  <td>Dummy Builder.io Pdf</td>
  <td>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault(); // Prevent the default link behavior
        pdfDownloadDummy(
          "https://honeywell.bynder.com/m/75ae18c48552a7d0/original/public_pmt-hps-etcr300-4-scn-pdf.pdf",
          "demo_builder"
        );
      }}
      className="download-link"
    >
      Download
    </a>
  </td>
</tr>
<tr>
  <td>Private Builder.io Pdf</td>
  <td>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault(); // Prevent the default link behavior
        authenticatedDownload(bynderPdf?.bynderPdf?.s3_file, "private_builder_pdf");
      }}
      className="download-link"
    >
      Download
    </a>
  </td>
</tr>

                                        
                   
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="who-viewed-container">
        <h2 className="who-viewed-title">
          People Who Viewed This item Also Viewed
        </h2>
      </div>

      <div className="bottom-beamhk">
        <div className="carousel-container">
          <div className="carat-container" onClick={handlePrevious}>
            <Image
              src={CaratLeft}
              alt="Left carat"
              className="product-carat-left"
            />
          </div>
          <ul className="carousel-list">
            {visibleItems.map((item, index) => (
              <li className="carousel-slide" key={index}>
                <Image src={item.src} alt={`Slide ${index}`} />
                <p className="carousel-text-top">{item.text}</p>
                <p className="carousel-text-bottom">{item.text2}</p>
              </li>
            ))}
          </ul>
          <div className="carat-container" onClick={handleNext}>
            <Image
              src={CaratRight}
              alt="Right carat"
              className="product-carat-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pip;
