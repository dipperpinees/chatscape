import React from 'react';
import ReactLoading from 'react-loading';

function Loading(props) {
    return (
        <div className="loading">
            <ReactLoading type="bars" color="#4BA978" height={52} width={52} />
        </div>
    );
}

export default Loading;