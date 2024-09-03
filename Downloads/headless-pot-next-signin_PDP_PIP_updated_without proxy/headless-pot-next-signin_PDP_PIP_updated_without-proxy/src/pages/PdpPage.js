/*
import React from "react";

export default function PDP_page() {
    return (
        <div>
            <h1>PDP_page</h1>
        </div>
    )
}
    */


import Pdp from "../components/pdp";
import axios from 'axios';
import { detailsApi, contactApi } from '../utils/ApiList/axiosapi';

export default function PdpPage({ detailData, contactData, error }) {
    return (
//const PdpPage = () => {

    //return (
        <>
           <Pdp/>
        </>
    );
};

//export default PdpPage;
export async function getServerSideProps() {
    try {
        const [detailsResponse, contactResponse] = await Promise.all([
            axios.get(detailsApi),
            axios.get(contactApi)
        ]);

        return {
            props: {
                detailData: detailsResponse.data,
                contactData: contactResponse.data,
                error: null
            }
        };
    } catch (error) {
        return {
            props: {
                detailData: [],
                contactData: [],
                error: error.message || 'Error fetching data'
            }
        };
    }
}