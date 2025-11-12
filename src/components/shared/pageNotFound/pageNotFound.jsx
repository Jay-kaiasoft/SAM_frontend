import React from 'react'

const PageNotFound = props => {
    return (
        <>
            <div className="midleMain p-0">
                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <div className="w-75 shadow p-5 d-flex flex-column justify-content-center align-items-center">
                        <p className="font-size-100 font-weight-bold mb-0">404</p>
                        <p className="font-size-20 mb-5">OPPS!!! PAGE NOT FOUND</p>
                        <p className="font-size-20">Sorry, the page you're looking for doesn't exist.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PageNotFound