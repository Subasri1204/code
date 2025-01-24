'use client';

import React, { useState } from 'react';
import ProductList from './components/assetlist'; 
import styles from '../../styles/GlobalSearch.module.css';
import AssetList from './components/assetlist';

export default function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [facetSelections, setFacetSelections] = useState({});
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);


    // Function to handle the search
    const search = async () => {
        setLoading(true);
        setErrors([]);
        try {
            const response = await fetch('/api/emasearch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchTerm, facets: facetSelections }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const searchResponse = await response.json();

            // Check for errors in the response
            if (searchResponse.errors.length > 0) {
                setErrors(searchResponse.errors);
            } else {
                setResults(searchResponse.results);
            }
        } catch (error) {
            console.error('Search error:', error);
            setErrors([error.message]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.resultsContainer}>
                {loading ? (
                    <p>Loading...</p>
                ) : errors.length > 0 ? (
                    <div>
                        {errors.map((error, index) => (
                            <p key={index} className={styles.errorText}>
                                {error}
                            </p>
                        ))}
                    </div>
                ) : results ? (
                    <>
                        {/* Render Product List if available */}
                        {results.products && <AssetList
                            assets={results.assets}
                            totalAssets={results.totalAssets} />}                       
                    </>
                ) : null}
            </div>
        </div>
    );
}