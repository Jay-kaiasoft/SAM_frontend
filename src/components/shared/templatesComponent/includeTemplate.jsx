import React from "react";
import Demo14 from "./demo14";
import Demo1 from "./demo1";
import Demo2 from "./demo2";
import Demo3 from "./demo3";
import Demo4 from "./demo4";
import Demo5 from "./demo5";
import Demo6 from "./demo6";
import Demo7 from "./demo7";
import Demo8 from "./demo8";
import Demo9 from "./demo9";
import Demo10 from "./demo10";
import Demo11 from "./demo11";
import Demo12 from "./demo12";
import Demo15 from "./demo15";

const IncludeTemplate = ({tname}) => {
    switch(tname){
        case "demo14":
            return <Demo14 />;
        case "demo1":
            return <Demo1 />;
        case "demo2":
            return <Demo2 />;
        case "demo3":
            return <Demo3 />;
        case "demo4":
            return <Demo4 />;
        case "demo5":
            return <Demo5 />;
        case "demo6":
            return <Demo6 />;
        case "demo7":
            return <Demo7 />;
        case "demo8":
            return <Demo8 />;
        case "demo9":
            return <Demo9 />;
        case "demo10":
            return <Demo10 />;
        case "demo11":
            return <Demo11 />;
        case "demo12":
            return <Demo12 />;
        case "demo15":
            return <Demo15 />;
        default :
            return <Demo14 />;
    }
}

export default IncludeTemplate;