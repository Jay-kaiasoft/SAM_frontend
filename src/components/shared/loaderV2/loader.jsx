import Lottie from "lottie-react";
import loaderAnimation from "../loader/loaderAnimation.json";

const Loader = () => {
  return (
    <div className="loading-main-ai d-flex flex-column align-items-center justify-content-center">
      <div className="lottie-main-big">
          <Lottie animationData={loaderAnimation} loop={true} />
      </div>
      <div className="text-black">Please wait !!!</div>
    </div>
  );
};

export default Loader;
