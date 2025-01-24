// components/ProductList.js
import React, { useState } from 'react';
import styles from '../../../styles/GlobalSearch.module.css';
import pdfIcon from '../../../public/pdfIcon.png';
import Image from 'next/image';

const TechPubList = ({ products, totalProducts }) => {
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
                        <div className={styles.pdfIcon}>
                            <Image
                                src={pdfIcon}
                                width={50}
                                height={50}
                            />
                        </div>
                        <div className={styles.productDetails}>
                            <h4>{product.title}</h4>
                            <p className={styles.shortDescription}>{product.description}</p>
                            {/*<p className={styles.shortDescription}>{product.url}</p>*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechPubList;
