import React from "react";
import InputField from '../shared/commonControlls/inputField';

const TimerComponent = ({data, handleDataChange}) => {
    const timeDurations = [
        { key: "minutes", label: "Minutes" },
        { key: "hour", label: "Hour" },
        { key: "day", label: "Day" },
        { key: "week", label: "Week" },
        { key: "month", label: "Month" }
    ];
    return (
        <div>
            <p className='heading-style'>How long do you want to give your audience a chance to read your Email before proceeding to the next work flow stage?</p>
            <div style={{ display: "flex", flex: "row" }} className="mt-5">
                <div style={{ width: "90px" }}>
                    <InputField
                        label="No. of"
                        value={data?.value}
                        id="value"
                        name="value"
                        onChange={handleDataChange}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "row", margin: "5px 0px 0px 10px", borderWidth: "1px" }}>
                    {timeDurations.map((item) => {
                        return (
                            <div
                                key={item.key}
                                className={`time-duration-box ${data?.duration === item?.key ? "active" : ""}`}
                                onClick={() => handleDataChange("duration", item.key)}
                            >{item.label}</div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default TimerComponent;