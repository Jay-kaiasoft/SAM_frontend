
export const dateFormats = [
    {
        key: "YYYYMMDD",
        value: "YYYY-MM-DD"
    },
    {
        key: "MMDDYYYY",
        value: "MM-DD-YYYY"
    },
    {
        key: "DDMMYY",
        value: "DD-MM-YY"
    },
    {
        key: "DDMONYY",
        value: "DDMONYY"
    },
    {
        key: "DDMONYYYY",
        value: "DD-MON-YYYY"
    },
    {
        key: "MONDDYYYY",
        value: "MONDDYYYY"
    },
    {
        key: "MONDDYY",
        value: "MON-DD-YY"
    },
]

export const headerDropdownValues = (data) => {
    let dropDownValues = [];
    data.forEach(it => {
        const value = {
            key: it,
            value: it
        }
        dropDownValues.push(value);
    })
    return dropDownValues;
}

export const rowLabelValues = (data) => {
    let values = [];
    let i;
    for (i = 1; i <= Object.keys(data).length; i++) {
        const value = {
            key: i,
            value: data[i],
            dropDownName: `${i}`
        }
        values.push(value);
    }
    return values;
}

export const findDuplicates = (data) => {
    const arr = new Set();
    let i
    for (i = 1; i <= Object.keys(data).length; i++) {
        if (arr.has(data[i])) {
            return true;
        }
        else {
            arr.add(data[i]);
        }
    }
    return false;
}

export const modifyHeaders = (data) => {
    const arr=data;
    let i
    let count = 1;
    for (i = 1; i <= Object.keys(data).length; i++) {
        if (data[i] === "Add this field") {
            data[i]=`custom field ${count++}`
        }
    }
    return arr;
}