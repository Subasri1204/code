'use client';

import React, { useState } from 'react';
import ProductList from './global-search/components/productlist'; 
import AEMList from './global-search/components/aemlist'; 
import TechPubList from './global-search/components/techpublist';
import styles from '../styles/GlobalSearch.module.css';

export default function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [facetSelections, setFacetSelections] = useState({});
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // Default tab

    // Function to handle the search
    const search = async () => {
        setLoading(true);
        setErrors([]);
        try {
            const response = await fetch('/api/nativesearch', {
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

    const renderTabContent = () => {
        // Render content based on the active tab
        switch (activeTab) {
            case 'products':
                return results.products ? (
                    <ProductList products={results.products} totalProducts={results.productTotalResults} />
                ) : null;

            case 'content':
                return results.aemcontents ? (
                    <AEMList products={results.aemcontents} totalProducts={results.aemTotalResults} />
                ) : null;

            case 'files':
                return results.techpubs ? (
                    <TechPubList products={results.techpubs} totalProducts={results.techPubTotalResults} />
                    //<div>
                    //    {/* Render file results if available */}
                    //    {results.techpubs.map((file, index) => (
                    //        <div key={index}>
                    //            <h4>{file.title}</h4>
                    //            <p>{file.description}</p>
                    //        </div>
                    //    ))}
                    //</div>
                ) : null;

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1>Building Automation - Global Search</h1>
            </header>

            {/* Main Layout Wrapper */}
            <div className={styles.mainContentWrapper}>
                {/* Search Section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter search term"
                            className={styles.searchInput}
                        />
                        <button onClick={search} className={styles.searchButton}>
                            Search
                        </button>
                    </div>
                </div>

                {/* Results and Facets Section */}
                <div className={styles.resultsAndFacets}>
                    {/* Facets Section */}
                    <div className={styles.facetsContainer}>
                        <h2>Facets</h2>
                        {/*<ul>*/}
                        {/*    <li>Facet Option 1</li>*/}
                        {/*    <li>Facet Option 2</li>*/}
                        {/*    <li>Facet Option 3</li>*/}
                        {/*</ul>*/}
                        {/* Dynamic facets can be added here */}
                    </div>

                    {/* Results Section */}
                    <div className={styles.resultsContainer}>
                        {/* Tab Buttons */}
                        <div className={styles.tabContainer}>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'products' ? styles.active : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                Products
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
                                onClick={() => setActiveTab('content')}
                            >
                                Site Content
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === 'files' ? styles.active : ''}`}
                                onClick={() => setActiveTab('files')}
                            >
                                Technical Publications
                            </button>
                        </div>

                        <div className={styles.resultsContent}>
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
                            ) : (
                                renderTabContent() // Render results based on the active tab
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}