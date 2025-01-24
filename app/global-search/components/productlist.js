// components/ProductList.js
import React, { useState } from 'react';
import styles from '../../../styles/GlobalSearch.module.css';

const ProductList = ({ products , totalProducts}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const productsToShow = 25; // Number of products to display at a time

    const handleNext = () => {
        if (currentIndex + productsToShow < products.length) {
            setCurrentIndex(currentIndex + productsToShow);
        }
    };

    const handlePrevious = () => {
        if (currentIndex - productsToShow >= 0) {
            setCurrentIndex(currentIndex - productsToShow);
        }
    };

    return (
        <div className={styles.productSection}>
            <div className={styles.productHeader}>
                <h2></h2>
                <p>{totalProducts} results</p>
            </div>
            <div className={styles.productList}>
                {products.slice(currentIndex, currentIndex + productsToShow).map((product, index) => (
                    <div key={index} className={styles.productItem}>
                        <div className={styles.productImage}>
                            <img
                                src={product.thumbnail}
                                alt="image" // Using the product title for better accessibility
                                width={100}
                                height={100}
                            />
                        </div>
                        <div className={styles.productDetails}>
                            <h4>{product.title}</h4>
                            <p className={styles.shortDescription}>{product.description}</p>
                            <p>&nbsp;</p>
                            <p className={styles.skuList}>SKUs:  {product.sku_list}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    //return (
    //    <div className={styles.productSection}>
    //        <div className={styles.productHeader}>
    //            <h2>Products</h2>
    //            <p>{totalProducts} results</p>
    //        </div>
    //        <div >
    //            {products.slice(currentIndex, currentIndex + productsToShow).map((product, index) => (                    
    //                <div key={index}>
    //                    <div>
    //                        <img
    //                            src={product.thumbnail}
    //                            alt="Description of the image"
    //                            width={50}
    //                            height={50}
    //                        ></img>
    //                    </div>
    //                    <h4>{product.title}</h4>
    //                    <p className={styles.shortDescription}>{product.description}</p>
    //                    {/*<p>{product.description}</p>*/}
    //                    <p>&nbsp;</p>
                       
    //                </div>
    //            ))}
    //        </div>
            {/*<div className={styles.productList}>*/}
            {/*    {products.slice(currentIndex, currentIndex + productsToShow).map((product, index) => (*/}
            {/*        <div key={index} className={styles.productItem}>*/}
            {/*            <h3>{product.title}</h3>*/}
            {/*            <p>{product.short_description}</p>*/}
            {/*            */}{/*<p>{product.description}</p>*/}
            {/*            <p>&nbsp;</p>*/}
            {/*            <a href={product.url} target="_blank" rel="noopener noreferrer" className={styles.learnMore}>*/}
            {/*                LEARN MORE*/}
            {/*            </a>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {/*<div className={styles.navigation}>*/}
            {/*    {currentIndex > 0 && <button onClick={handlePrevious}>⬅</button>}*/}
            {/*    {currentIndex + productsToShow < products.length && <button onClick={handleNext}>➡</button>}*/}
            {/*</div>*/}
    //    </div>
    //);
};

export default ProductList;
