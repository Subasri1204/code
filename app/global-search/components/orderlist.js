// components/OrderList.js
import React from 'react';
import styles from '../../../styles/GlobalSearch.module.css';

const OrderList = ({ orders }) => {
    return (
        <div className={styles.orderContainer}>
            {orders.map((order, index) => (
                <div key={index} className={styles.orderItem}>
                    <h3>Order Number: {order.order_number}</h3>
                    <p>Customer Number: {order.customer_number}</p>
                    <p>Date: {order.order_created_date}</p>
                    <p>Status: {order.status}</p>
                    <p>Total Amount: {order.total_amount}</p>
                </div>
            ))}
        </div>
    );
};

export default OrderList;
