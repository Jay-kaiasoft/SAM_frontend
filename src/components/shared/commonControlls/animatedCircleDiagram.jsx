import React, {useEffect, useState} from "react";
import {CircularProgressbarWithChildren, buildStyles} from "react-circular-progressbar";
import {Animate} from "react-move";
import { easeQuadInOut } from "d3-ease";
import { websiteColor } from "../../../config/api";


const AnimatedProgressProvider = ({valueStart, valueEnd, easingFunction, duration, children})=>{
    const [isAnimated, setIsAnimated] = useState(false);
    useEffect(()=>{
        setIsAnimated(prevState => !prevState);
    }, []);
    return (
        <Animate
            start={() => ({
                value: valueStart
            })}
            update={() => ({
                value: [
                    isAnimated ? valueEnd : valueStart
                ],
                timing: {
                    duration: duration * 1000,
                    ease: easingFunction
                }
            })}
        >
            {({ value }) => children(value)}
        </Animate>
    );
}
const AnimatedCircleDiagram = ({
    percentage=0,
    textColor="#585858",
    pathColor=websiteColor,
    trailColor ="rgb(202, 202, 202)",
    strokeWidth=3,
    animationDuration=1.4,
    isAnimated=true
}) => {
    return (
        <div className="d-flex justify-content-center ">
            <div className="circle-progress-bar">
                {isAnimated?
                    <AnimatedProgressProvider
                        valueStart={0}
                        valueEnd={percentage}
                        duration={animationDuration}
                        easingFunction={easeQuadInOut}
                    >
                        {
                            (value)=>{
                                const roundedValue = value.toFixed(2);
                                return (
                                    <CircularProgressbarWithChildren
                                        value={value}
                                        strokeWidth={strokeWidth}
                                        styles={buildStyles({
                                            pathColor: pathColor,
                                            trailColor: trailColor,
                                        })}
                                    >
                                        <h1 style={{color: textColor}}>{roundedValue}%</h1>
                                    </CircularProgressbarWithChildren>
                                );
                            }
                        }
                </AnimatedProgressProvider>:
                <CircularProgressbarWithChildren
                    value={percentage}
                    strokeWidth={strokeWidth}
                    styles={buildStyles({
                        pathColor: pathColor,
                        trailColor: trailColor,
                    })}
                >
                    <h1 style={{color: textColor}}>{percentage.toFixed(2)}%</h1>
                </CircularProgressbarWithChildren>

                }
            </div>
        </div>
    );
};

export default AnimatedCircleDiagram;
