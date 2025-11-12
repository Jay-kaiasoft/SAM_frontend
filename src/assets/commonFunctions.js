import { format, formatDuration, intervalToDuration } from "date-fns";
import { getCountryId, getCountryName } from "../services/commonService";
import $ from "jquery";
import { Box, Paper, Popper, StepConnector, stepConnectorClasses, styled, Typography } from "@mui/material";
import Check from "@mui/icons-material/Check";
import React from "react";
import axios from "axios";
import googleLibphonenumber from "google-libphonenumber";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { UAParser } from "ua-parser-js";
import { saveDataTracker } from "../services/userService";
import { geoLocationKey, siteURL, supportArticleUrl, websiteColor } from "../config/api";
import { compressAccurately, filetoDataURL } from "image-conversion";
import { save10DLCData, set10DLCStatus } from "../services/profileService";

export const characterNumberOnly = (value) => {
    if (!value) return value;
    return value.replace(/[^\w]/g, "");
}
export const numberOnly = (value) => {
    if (!value) return value;
    return value.replace(/[^\d]/g, "");
}
export const dateFormat = (value) => {
    if (!value) return value;
    return (format(new Date(value), 'MM/dd/yyyy'));
}
export const timeFormat = (value) => {
    if (!value) return value;
    return (format(new Date(value), 'hh:mm a'));
}
export const timeFormat24 = (value) => {
    if (!value) return value;
    return (format(new Date(value), 'HH:mm:ss'));
}
export const dateTimeFormat = (value) => {
    if (!value) return value;
    return (format(new Date(value), 'MM/dd/yyyy hh:mm a'));
}
export const dateTimeFormatDB = (value) => {
    if (!value) return value;
    return (format(new Date(value), 'MM/dd/yyyy HH:mm:ss'));
}
export const dateFormatContactHistory = (value) => {
    if (!value) return value;
    return (format(new Date(value), 'MMM do, yyyy'));
}
export const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "";
    return (firstName.charAt(0) + lastName.charAt(0));
}
export const displayCountryName = (countryId) => {
    getCountryName(countryId).then(res => {
        if (res.status === 200) {
            return res.result.countryName;
        }
    })
}
export const displayCountryId = (countryName) => {
    getCountryId(countryName).then(res => {
        if (res.status === 200) {
            return res.result.countryId;
        }
    })
}
export const deteTimeFormatDashboard = (value) => {
    if (!value)
        return value
    return (format(new Date(value), "MMM do yyyy hh:mm:ss a"))
}
export const dateFormatDashboard = (value) => {
    if (!value)
        return value
    return (format(new Date(value), "MMM do yyyy"))
}
export const getObjectTime = (value) => {
    if (!value) return value;
    let ampm = value.split(" ")[1];
    let hours = parseInt(value.split(" ")[0].split(":")[0]);
    let minutes = parseInt(value.split(" ")[0].split(":")[1]);
    if (ampm === "AM" || ampm === "am") {
        if (hours === 12) {
            hours = 0
        }
    } else {
        if (hours !== 12) {
            hours += 12;
        }
    }
    let obj = new Date();
    obj.setHours(hours);
    obj.setMinutes(minutes);
    return obj;
}
export const tableToExcel = (function () {
    let uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name, fileName) {
        let ctx = { worksheet: name || 'Worksheet', table: table }
        let link = document.createElement('a');
        link.setAttribute('href', uri + base64(format(template, ctx)));
        link.setAttribute('download', fileName);
        link.click();
        link.remove();
    }
})();
export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}
export const copyLink = (elementName, iconSelactor) => {
    document.querySelector(`[name='${elementName}']`).select();
    document.execCommand('copy');
    document.querySelector(`[name='${elementName}']`).focus();
    document.querySelector("#" + iconSelactor).setAttribute("data-original-title", "Copied");
    $("#" + iconSelactor).tooltip('hide');
    $("#" + iconSelactor).tooltip('show');
}
export const copyElementText = (id, iconSelactor, message = "Copied") => {
    setTimeout(()=>{
        var range = document.createRange();
        var selection = window.getSelection();
        range.selectNodeContents(document.querySelector("#"+id));
        selection.removeAllRanges();
        selection.addRange(range);
    },100);
    var text = document.getElementById(id).innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    document.querySelector("#" + iconSelactor).setAttribute("data-original-title", message);
    $("#" + iconSelactor).tooltip('hide');
    $("#" + iconSelactor).tooltip('show');
}
const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
        color: websiteColor,
    }),
    '& .QontoStepIcon-completedIcon': {
        color: websiteColor,
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));
export const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: websiteColor,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: websiteColor,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));
export const QontoStepIcon = (props) => {
    const { active, completed, className } = props;
    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
};
export const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};
export const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
};
export const searchIconTransparent = {
    root: {
        "&:hover": {
            backgroundColor: "transparent !important"
        }
    }
};
export const getHostData = async () => {
    return await axios.get('https://api.radar.io/v1/geocode/ip',{ headers: { 'Authorization': geoLocationKey } }).then(res => res);
}
export const getColors = (n) => {
    const totalColors = ['rgb(230, 115, 145)', 'rgb(230, 210, 148)', 'rgb(221, 11, 77)', 'rgb(183, 39, 181)', 'rgb(113, 69, 86)', 'rgb(171, 195, 221)', 'rgb(60, 156, 1)', 'rgb(160, 124, 255)', 'rgb(171, 52, 219)', 'rgb(4, 107, 131)', 'rgb(133, 254, 161)', 'rgb(22, 247, 93)', 'rgb(30, 109, 146)', 'rgb(204, 92, 26)', 'rgb(66, 249, 246)', 'rgb(255, 141, 33)', 'rgb(154, 241, 154)', 'rgb(143, 166, 8)', 'rgb(113, 216, 186)', 'rgb(10, 103, 112)', 'rgb(50, 147, 5)', 'rgb(68, 175, 20)', 'rgb(206, 41, 236)', 'rgb(190, 64, 132)', 'rgb(57, 133, 175)', 'rgb(10, 125, 241)', 'rgb(70, 106, 46)', 'rgb(174, 104, 55)', 'rgb(192, 44, 73)', 'rgb(220, 37, 14)', 'rgb(17, 106, 113)', 'rgb(180, 199, 71)', 'rgb(44, 109, 208)', 'rgb(96, 174, 109)', 'rgb(71, 198, 236)', 'rgb(170, 62, 197)', 'rgb(162, 204, 127)', 'rgb(229, 14, 155)', 'rgb(86, 93, 47)', 'rgb(123, 143, 255)', 'rgb(133, 101, 163)', 'rgb(137, 102, 42)', 'rgb(42, 191, 182)', 'rgb(57, 207, 115)', 'rgb(106, 136, 72)', 'rgb(133, 112, 87)', 'rgb(173, 203, 160)', 'rgb(47, 65, 188)', 'rgb(16, 136, 90)', 'rgb(239, 159, 165)', 'rgb(48, 238, 34)', 'rgb(6, 204, 19)', 'rgb(169, 188, 146)', 'rgb(186, 87, 239)', 'rgb(75, 57, 243)', 'rgb(221, 105, 190)', 'rgb(195, 24, 53)', 'rgb(6, 62, 212)', 'rgb(83, 78, 187)', 'rgb(179, 147, 193)', 'rgb(220, 201, 31)', 'rgb(23, 158, 122)', 'rgb(108, 215, 130)', 'rgb(9, 93, 220)', 'rgb(117, 19, 235)', 'rgb(23, 214, 9)', 'rgb(57, 193, 175)', 'rgb(179, 250, 5)', 'rgb(216, 148, 236)', 'rgb(191, 145, 41)', 'rgb(216, 111, 97)', 'rgb(140, 7, 121)', 'rgb(218, 203, 153)', 'rgb(88, 181, 15)', 'rgb(61, 176, 131)', 'rgb(201, 16, 204)', 'rgb(125, 138, 186)', 'rgb(179, 89, 210)', 'rgb(28, 64, 249)', 'rgb(202, 196, 112)'];
    const colors = [];
    for (let i = 0; i < n; i++) {
        if (i < totalColors.length) {
            colors.push(totalColors[i]);
        } else {
            const hue = (i * 360) / n;
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
    }
    return colors;
}

export const easUrlEncoder = (str) => {
    if (typeof str === "string") {
        str = str.replaceAll("+", "%2B");
        str = str.replaceAll("@", "%40");
        str = str.replaceAll("#", "%23");
        str = str.replaceAll("$", "%24");
        str = str.replaceAll(",", "%2C");
        str = str.replaceAll(":", "%3A");
        str = str.replaceAll(";", "%3B");
        str = str.replaceAll("//", "%2F/");
    }
    return str;
}
export const encoderQuote = (str) => {
    if (typeof str === "string") {
        str = str.replaceAll("\"", "&quot;");
    }
    return str;
}

export const displayFormatNumber = (oldNumber, countryCode) => {
    const PNF = googleLibphonenumber.PhoneNumberFormat;
    const phoneUtil = googleLibphonenumber.PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(oldNumber, countryCode);
    return phoneUtil.format(number, PNF.NATIONAL)
}

export const convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    return `${h === 0 ? "" : h + " Hour"} ${m === 0 ? "" : m + " Minute"}`;
}

export const getClientTimeZone = () => {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Kolkata") {
        return "Asia/Calcutta";
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

export const handleClickHelp = (url) => {
    window.open(supportArticleUrl + url, "_blank");
}

export const toCamelCase = (string) => {
    string = string.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return string;
}

export const numberWithCommas = (x) => {
    if (typeof x === "undefined" || x === "" || x === null) {
        return;
    } else {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export const CSSstring = (string) => {
    const css_json = `{"${string
        .replace(/; /g, '", "')
        .replace(/: /g, '": "')
        .replace(";", "")}"}`;

    const obj = JSON.parse(css_json);

    const keyValues = Object.keys(obj).map((key) => {
        let camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase());
        return { [camelCased]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}
export const genrateCsv = (type, name, questions, countryList) => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true, showColumnHeaders: false, filename: name + "_report" });
    let csvArr = [];

    csvArr.push({ col1: type, col2: name, col3: "", col4: "" });
    csvArr.push({ col1: "", col2: "", col3: "", col4: "" });
    questions.forEach((e) => {
        csvArr.push({ col1: e.disOrder, col2: e.question, col3: "", col4: e.totalAnsForQues });
        if (e.queTypeId === 1 || e.queTypeId === 6) {
            e.optionList.forEach((f) => {
                csvArr.push({ col1: "", col2: `${f.perColor}%`, col3: f.optionVal, col4: f.totalAns });
            });
        } else if (e.queTypeId === 2) {
            e.optionList.forEach((f) => {
                csvArr.push({ col1: "", col2: "", col3: f.optionVal, col4: "" });
            });
        } else if (e.queTypeId === 3) {
            e.rows.forEach((f) => {
                csvArr.push({ col1: "", col2: f, col3: "", col4: "" });
                e[f].forEach((g) => {
                    csvArr.push({ col1: "", col2: `${g.perColor}%`, col3: g.optionVal, col4: g.totalAns });
                })
            })
        } else if (e.queTypeId === 4) {
            e.optionList.forEach((f) => {
                e.labels.forEach((g) => {
                    csvArr.push({ col1: "", col2: g, col3: f[g], col4: "" });
                })
            })
        } else if (e.queTypeId === 5) {
            e.optionList.forEach((f) => {
                e.rows.forEach((g) => {
                    csvArr.push({ col1: "", col2: g, col3: "", col4: "" });
                    e.columns.forEach((h) => {
                        csvArr.push({ col1: "", col2: h, col3: f[g][h], col4: "" });
                    })
                })
            })
        }
        csvArr.push({ col1: "", col2: "", col3: "", col4: "" });
    });
    csvArr.push({ col1: "", col2: "", col3: "", col4: "" });
    csvArr.push({ col1: "Demographic", col2: "", col3: "", col4: "" });
    csvArr.push({ col1: "", col2: "", col3: "", col4: "" });
    countryList.forEach((e) => {
        csvArr.push({ col1: e.countryName, col2: "", col3: "", col4: e.visit });
        e.stateList.forEach((f) => {
            csvArr.push({ col1: "", col2: f.stateName, col3: "", col4: f.visit });
            f.cityList.forEach((g) => {
                csvArr.push({ col1: "", col2: "", col3: g.cityName, col4: g.visit });
            })
        })
        csvArr.push({ col1: "", col2: "", col3: "", col4: "" });
    })
    const csv = generateCsv(csvConfig)(csvArr);
    download(csvConfig)(csv)
}
export const toRGB = (color) => {
    let div = $('<div></div>').appendTo("body").css('background-color', color);
    let computedStyle = window.getComputedStyle(div[0]);
    let computedColor = computedStyle.backgroundColor;
    div.remove();
    const { style } = new Option();
    style.color = computedColor;
    return style.color;
}
export const checkCreateURL = (url, globalAlert) => {
    try {
        new URL(url);
        url = url.replace("http://", "").replace("https://", "");
        // if (url.match(/www./gm) === null) {
        //     url = "www." + url;
        // }
        if (url.match(/http(s):\/\//gm) === null) {
            url = "https://" + url;
        }
        return url;
    } catch (err) {
        url = url.replace("http://", "").replace("https://", "");
        // if (url.match(/www./gm) === null) {
        //     url = "www." + url;
        // }
        if (url.match(/http(s):\/\//gm) === null) {
            url = "https://" + url;
        }
        try {
            new URL(url);
            return url;
        } catch (err) {
            globalAlert({
                type: "Error",
                text: `Invalid website URL`,
                open: true
            });
            return;
        }
    }
}
const generateFingerprint = () => {
    let fingerprint = [];
    fingerprint.push(navigator.userAgent);
    fingerprint.push(window.screen.width + "x" + window.screen.height);
    if (navigator.plugins && navigator.plugins.length) {
        for (let i = 0; i < navigator.plugins.length; i++) {
            let plugin = navigator.plugins[i];
            fingerprint.push(plugin.name + "::" + plugin.description);
        }
    }
    let timezoneOffset = new Date().getTimezoneOffset();
    fingerprint.push(timezoneOffset);
    fingerprint.push(navigator.language);
    fingerprint.push(navigator.platform);
    let fingerprintString = fingerprint.join("###");
    let fingerprintHash = hashString(fingerprintString);
    return fingerprintHash;
}
const hashString = (string) => {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return hash;
}
export const usePageTracker = (memberId, subMemberId) => {
    let location = useLocation();
    React.useEffect(() => {
        getHostData().then((res) => {
            let parser = new UAParser();
            let requestData = {
                "trackId": 0,
                "fingerPrint": generateFingerprint(),
                "ip": res.data.ip,
                "ipOrg": "",
                "country": res.data.address.country,
                "state": res.data.address.state,
                "city": res.data.address.city,
                "postalCode": "",
                "latitude": res.data.address.latitude,
                "longitude": res.data.address.longitude,
                "memberId": memberId || 0,
                "subMemberId": subMemberId || 0,
                "userAgent": JSON.stringify(parser.getResult()),
                "screen": window.screen.width + "x" + window.screen.height,
                "timeZoneOffset": new Date().getTimezoneOffset(),
                "language": navigator.language,
                "platform": navigator.platform,
                "pageName": location.pathname.replaceAll("/", ""),
                "websiteName": siteURL
            }
            saveDataTracker(requestData).then((res1) => { });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
}
export const setBrandColorsToLocal = (brandKits) => {
    let tempBrandColors = "";
    for (let bc = 0; bc < brandKits?.length; bc++) {
        if (typeof brandKits[bc]?.brandColors !== "undefined" && brandKits[bc]?.brandColors !== "" && brandKits[bc]?.brandColors !== null) {
            if (tempBrandColors !== "")
                tempBrandColors = tempBrandColors + ";" + brandKits[bc]?.brandColors;
            else
                tempBrandColors = brandKits[bc]?.brandColors;
        }
    }
    if (tempBrandColors !== "") {
        let tempObj = tempBrandColors.split(";").map(JSON.stringify);
        let uniqueObj = new Set(tempObj);
        let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
        tempBrandColors = uniqueArr.join(";");
        if (typeof localStorage.getItem("spectrum.homepage") !== "undefined" && localStorage.getItem("spectrum.homepage") !== "" && localStorage.getItem("spectrum.homepage") !== null) {
            let spectrumColor = localStorage.getItem("spectrum.homepage") + ";" + tempBrandColors;
            let tempObj = spectrumColor.split(";").map(JSON.stringify);
            let uniqueObj = new Set(tempObj);
            let uniqueArr = Array.from(uniqueObj).map(JSON.parse);
            localStorage.setItem("spectrum.homepage", uniqueArr.join(";"));
        } else {
            localStorage.setItem("spectrum.homepage", tempBrandColors);
        }
    }
}
let captchaCode;
export const createCaptcha = (id) => {
    let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let a = alpha[Math.floor(Math.random() * alpha.length)];
    let b = alpha[Math.floor(Math.random() * alpha.length)];
    let c = alpha[Math.floor(Math.random() * alpha.length)];
    let d = alpha[Math.floor(Math.random() * alpha.length)];
    let e = alpha[Math.floor(Math.random() * alpha.length)];
    let f = alpha[Math.floor(Math.random() * alpha.length)];
    captchaCode = a + ' ' + b + ' ' + c + ' ' + d + ' ' + e + ' ' + f;
    let element = document.getElementById(id),
        ctx = element.getContext("2d"),
        x = element.width / 2,
        img = new Image();
    img.src = "https://www.kaiasoft.com/assets/img/captchabg.png";
    img.onload = function () {
        let pattern = ctx.createPattern(img, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, element.width, element.height);
        ctx.font = "46px Roboto Slab";
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.setTransform(1, -0.12, 0, 1, 0, 15);
        ctx.fillText(captchaCode, x, 55);
    };
}
export const validateCaptcha = (value) => {
    var string1 = removeSpaces(captchaCode);
    var string2 = removeSpaces(value);
    if (string1 === string2) {
        return true;
    } else {
        return false;
    }
}
const removeSpaces = (string) => {
    return string.split(' ').join('');
}
export const localGetWeekOfMonth = (date) => {
    let arr = ["first", "second", "third", "fourth", "fifth", "sixth"];
    let no = Math.ceil(format(new Date(date), 'd')/7)-1;
    return arr[no];
}  
export async function imageUrlToPngBlob(imageUrl, blank="") {
    try {
        const response = await fetch(imageUrl, { mode: 'cors' });
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgUrl;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(blank !== "yes"){
            ctx.drawImage(img, 0, 0);
        }
        const pngBlob = await new Promise((resolve) =>
            canvas.toBlob(resolve, 'image/png')
        );
        URL.revokeObjectURL(imgUrl);
        let fileName = imageUrl.split("/").pop();
        if(blank === "yes"){
            fileName = "mask.png";
        }
        const file = new File([pngBlob], fileName, {
            type: pngBlob.type,
        });
        return file;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export const createSmallThumb = async (canvas) => {
    const pngBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
    );
    let compressThumb = await compressAccurately(pngBlob,100);
    let compressThumbURL = await filetoDataURL(compressThumb);
    return compressThumbURL;
}
export const fontData = [
    {
        "key": "Arial, Helvetica Neue, Helvetica, sans-serif",
        "value": "Arial"
    },
    {
        "key": "Brush Script MT, cursive",
        "value": "Brush Script MT"
    },
    {
        "key": "Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif",
        "value": "Calibri"
    },
    {
        "key": "Comic Sans MS, Marker Felt-Thin, Arial, sans-serif",
        "value": "Comic Sans MS"
    },
    {
        "key": "Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace",
        "value": "Courier New"
    },
    {
        "key": "Futura, Trebuchet MS, Arial, sans-serif",
        "value": "Futura"
    },
    {
        "key": "Garamond, Baskerville, Baskerville Old Face, Hoefler Text, Times New Roman, serif",
        "value": "Garamond"
    },
    {
        "key": "Georgia, Times, Times New Roman, serif",
        "value": "Georgia"
    },
    {
        "key": "Helvetica, Arial, sans-serif",
        "value": "Helvetica"
    },
    {
        "key": "Lucida Sans Unicode, Lucida Grande, sans-serif",
        "value": "Lucida"
    },
    {
        "key": "Palatino, Palatino Linotype, Palatino LT STD, Book Antiqua, Georgia, serif",
        "value": "Palatino"
    },
    {
        "key": "Tahoma, Verdana, Segoe, sans-serif",
        "value": "Tahoma"
    },
    {
        "key": "Times New Roman, Times, Baskerville, Georgia, serif",
        "value": "Times New Roman"
    },
    {
        "key": "Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif",
        "value": "Trebuchet MS"
    },
    {
        "key": "Verdana, Geneva, sans-serif",
        "value": "Verdana"
    },
    
];
export const checkPopupClose = (setLoader, setTenDLCStatus, closeWindow, globalAlert, setTenDLCValue=()=>{}) => {
    let interval = setInterval(() => {
        if(typeof window.sessionStorage.getItem('closeModal10DLC') !== "undefined" && window.sessionStorage.getItem('closeModal10DLC') !== 'false' && window.sessionStorage.getItem('closeModal10DLC') !== false && window.sessionStorage.getItem('closeModal10DLC') !== "" && window.sessionStorage.getItem('closeModal10DLC') !== null){
            let requestData = {
                status : true
            }
            set10DLCStatus(requestData).then(res => {
                setLoader({
                    load: true,
                    text: "Please wait !!!"
                });
                if (res.status === 200) {
                    let requestData2 = {   
                        "datBrandName":window.sessionStorage.getItem('10DLCBrandName'),
                        "datCampaignType":window.sessionStorage.getItem('10DLCCampaignType'),
                        "datIsActive":"No"
                    }
                    save10DLCData(requestData2).then(res2 => {
                        if (res2.status === 200) {
                            window.sessionStorage.setItem('closeModal10DLC', false);
                            setTenDLCStatus(true);
                            setTenDLCValue("Processing");
                            closeWindow.close();
                        } else {
                            globalAlert({
                                type: "Error",
                                text: res.message,
                                open: true
                            });
                        }
                    });
                } else {
                    globalAlert({
                        type: "Error",
                        text: res.message,
                        open: true
                    });
                }
            });
            clearInterval(interval);
            interval = null;
        }
    }, 1000);
}
export const PopoverTooltip = ({tabRef, showPopper, arrowRef, setArrowRef, i, showText}) => {
    return (
        <Popper
            open={showPopper}
            anchorEl={tabRef.current[i].current}
            placement="right"
            disablePortal={true}
            modifiers={[
                {
                    name: 'arrow',
                    enabled: true,
                    options: {
                        element: arrowRef,
                    },
                },
                {
                    name: 'preventOverflow',
                    enabled: false,
                    options: {
                        rootBoundary: 'viewport',
                    },
                },
            ]}
            style={{ zIndex: 2 }}
            className='ml-3'
        >
            <span ref={setArrowRef} className="popper-arrow" />
            <Paper sx={{ p: 1, position: "relative", zIndex: 2, backgroundColor: "#000000", color: "#ffffff", minWidth: "max-content" }}>
                <Typography variant="body2">{showText}</Typography>
            </Paper>
        </Popper>
    );
}
export function msToHHMMSS(ms) {
    const roundedMs = Math.round(ms / 1000) * 1000;
    const duration = intervalToDuration({
        start: 0,
        end: roundedMs,
    })
    const formatted = formatDuration(duration, {
        format: ['hours', 'minutes', 'seconds'],
        zero: true,
    })
    return formatted.replaceAll("hours", "H").replaceAll("minutes", "M").replaceAll("seconds", "S").replaceAll("hour", "H").replaceAll("minute", "M").replaceAll("second", "S");
}
export function detectBrowser(userAgent) {
    if (userAgent.includes("Firefox/")) {
        return <i className="fab fa-firefox" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Firefox"></i>;
    } else if (userAgent.includes("Edg/")) {
        return <i className="fab fa-edge" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Edge"></i>;
    } else if (userAgent.includes("OPR/") || userAgent.includes("Opera")) {
        return <i className="fab fa-opera" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Opera"></i>;
    } else if (userAgent.includes("Chrome/")) {
        return <i className="fab fa-chrome" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Chrome"></i>;
    } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
        return <i className="fab fa-safari" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Safari"></i>;
    } else {
        return <i className="fas fa-browser" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Browser"></i>;
    }
}
export function detectOperatingSystem(os) {
    if (os === 'Windows') {
        return <i className="fab fa-windows" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Windows"></i>;
    } else if (os === 'macOS') {
        return <i className="fab fa-apple" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="macOS"></i>;
    } else if (os === 'Linux') {
        return <i className="fab fa-linux" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Linux"></i>;
    } else if (os === 'Android') {
        return <i className="fab fa-android" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Android"></i>;
    } else if (os === 'iOS') {
        return <i className="fab fa-apple" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="iOS"></i>;
    } else {
        return <i className="fab fa-windows" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Windows"></i>;
    }
}
export function detectDeviceType(deviceType) {
    if (deviceType === 'desktop') {
        return <i className="fas fa-desktop" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Desktop"></i>;
    } else if (deviceType === 'mobile') {
        return <i className="fas fa-mobile-alt" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Mobile"></i>;
    } else {
        return <i className="fas fa-desktop" style={{ fontSize: "1.5em" }} data-toggle="tooltip" title="Desktop"></i>;
    }
}
export const dateFilterData = [
    { value: 'CUSTOM', label: 'Custom' },
    { value: 'TODAY', label: 'Today' },
    { value: 'YESTERDAY', label: 'Yesterday' },
    { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
    { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
    { value: 'THIS_MONTH', label: 'This Month' },
    { value: 'LAST_MONTH', label: 'Last Month' },
];
export function formatToDays(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const totalMinutes = (hours * 60) + minutes;
    const days = Math.floor(totalMinutes / 1440);
    return days === 0 ? timeStr : `${days} Days`;
}
export const normalizeUrl = (url) => {
    try {
        const u = new URL(url.includes("://") ? url : `https://${url}`);
        let hostname = u.hostname;
        if ((hostname.match(/\./g) || []).length === 1 && !hostname.startsWith("www.")) {
            hostname = `www.${hostname}`;
        }
        let path = u.pathname;
        if (path === "" || path === "/index.html") {
            path = "/";
        }
        return `${u.protocol}//${hostname}${path}`;
    } catch {
        return url;
    }
}