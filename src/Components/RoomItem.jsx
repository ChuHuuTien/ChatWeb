/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const RoomItem = ({ src, name }) => {
    return (
        <>
            <img src={ src } />

            <div>
                <span>{ name }</span>
            </div>
        </>
    );
};

export default RoomItem;