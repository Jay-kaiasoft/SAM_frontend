export const transformGroupUtil = (group) => {
    let dropdownValues = [];
    group.forEach(it => {
        if(it.lockGroup !== "Y"){
            const element = {
                key: it.groupId,
                value: it.groupName
            }
            dropdownValues.push(element);
        }
    })
    return dropdownValues;
}

export const transformUdfsWithoutHeader = (data, udfs) => {
    let count = 1;
    const udfObject = {}
    let i
    for (i = 0; i < udfs.length; i++) {
        const field = data[udfs[i]];
        if (field === "Add This Field") {
            udfObject[count] = `Custom Field ${count++}`
        }
        else if (field === "Do Not Add This Field") {
            count++
        }
        else {
            udfObject[count] = field
            count++
        }
    }
    return udfObject;
}
export const transformUdfsWithHeader = (data, udfs) => {
    let count = 1;
    const udfObject = {}
    let i
    for (i = 0; i < udfs.length; i++) {
        const field = data[udfs[i]];
        if (field === "Add This Field") {
            udfObject[count] = udfs[i]
            count++;
        }
        else if (field === "Do Not Add This Field") {
            count++;
            continue
        }
        else {
            udfObject[count] = field
            count++
        }
    }
    return udfObject;
}
export const checkDuplicates = (data) => {
    const arr = new Set();
    let isDuplicatePresent=false;
    Object.values(data).forEach(val => {
        if (arr.has(val)) {
            isDuplicatePresent=true
            return true
        }
        arr.add(val);
    });
    if(isDuplicatePresent)
        return true
    return false;
}