// components/OrderList.js
import React from 'react';
import styles from '../../../styles/GlobalSearch.module.css';

const AssetList = ({ assets, totalAssets }) => {
    return (
        <div className={styles.productContainer}>
            <div className={styles.productHeader}>
                <h2>Assets</h2>
                <p>{totalAssets} results</p>
            </div>

            {assets.map((asset, index) => (
                <div key={index} className={styles.orderItem}>                    
                    <p>{asset.asset_name}</p>
                </div>
            ))}
        </div>
    );
};

export default AssetList;
