// components/SkuList.js
import React, { useState } from 'react';
import styles from '../../../styles/GlobalSearch.module.css';

const SkuList = ({ skus, totalSkus }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const skusToShow = 5; // Number of SKUs to display at a time

    const handleNext = () => {
        if (currentIndex + skusToShow < skus.length) {
            setCurrentIndex(currentIndex + skusToShow);
        }
    };

    const handlePrevious = () => {
        if (currentIndex - skusToShow >= 0) {
            setCurrentIndex(currentIndex - skusToShow);
        }
    };

    return (
        <div className={styles.skuSection}>
            <div className={styles.skuHeader}>
                <h2>Part Numbers</h2>
                <p>{totalSkus == 10000 ? '10000+ results' : `${totalSkus} results` }</p>
            </div>
            <div >
                {skus.slice(currentIndex, currentIndex + skusToShow).map((sku, index) => (
  
                    <div key={index} >
                        <h3>{sku.title}</h3>
                        <p className={styles.shortDescription}>{sku.sku_description}</p>
                        {/* Display thumbnail image using the URL */}
                        {/*<img src={sku.url} alt={sku.title} className={styles.thumbnail} />*/}   
                        <p>&nbsp;</p>
                    </div>
                ))}
            </div>
            {/*<div className={styles.skuList}>*/}
            {/*    {skus.slice(currentIndex, currentIndex + skusToShow).map((sku, index) => (*/}
            {/*        <div key={index} className={styles.skuItem}>*/}
            {/*            <h3>{sku.title}</h3>*/}
            {/*            <p>{sku.sku_description}</p>*/}
            {/*            */}{/* Display thumbnail image using the URL */}
            {/*            <img src={sku.url} alt={sku.title} className={styles.thumbnail} />*/}
            {/*            <a href={sku.url} target="_blank" rel="noopener noreferrer" className={styles.learnMore}>*/}
            {/*                LEARN MORE*/}
            {/*            </a>*/}
            {/*        </div>*/}
            {/*    ))} */}
            {/*</div>*/}
            {/*<div className={styles.navigation}>*/}
            {/*    {currentIndex > 0 && <button onClick={handlePrevious}>⬅</button>}*/}
            {/*    {currentIndex + skusToShow < skus.length && <button onClick={handleNext}>➡</button>}*/}
            {/*</div>*/}
        </div>
    );
};

export default SkuList;
