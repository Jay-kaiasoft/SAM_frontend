import React from "react"
import { connect } from "react-redux"
import { setLoader } from "../../../actions/loaderActions"
import Lottie from "lottie-react";
import loaderAnimation from "./loaderAnimation.json";

const Loader = ({
    loader
}) => {
    return (
        <>
            {
                loader?.load ?
                    <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
                        <div className="lottie-main-big">
                            <Lottie animationData={loaderAnimation} loop={true} />
                        </div>
                        {loader?.text && <div className="text-black">{loader?.text}</div>}
                    </div> 
                :
                    null
            }
        </>
    )
}

const mapStateToProps = state => {
    return {
        loader: state.loader
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setLoader: (data) => {
            dispatch(setLoader(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader)