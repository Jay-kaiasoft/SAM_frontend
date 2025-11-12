import { MenuItem, Select } from "@mui/material"

const EntriesPerPage = ({ perPage, handleChangePerPage = () => { } }) => {
    return (
        <div>
            <span className="align-middle">Show</span>
            <Select
                name="perPage"
                onChange={handleChangePerPage}
                value={perPage}
                className="mx-2 align-middle"
                variant="standard"
            >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={75}>75</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </Select>
            <span className="align-middle">entries</span>
        </div>
    )
}

export default EntriesPerPage