import { Col, Row } from "reactstrap";
import { Box } from '@mui/material';

const CreateImageVideo = ({ image, setSms, refIndex, initSmsCost }) => {
    const deleteVideo = (key) => {
        setSms((prev) => {
            let temp = [...prev];
            temp.splice(key, 1);
            return [...temp];
        });
    }
    return (
        <Row className="msgSortableItem">
            <Col sm={11} className="pl-3 pr-0">
                <Box sx={{ bgcolor: '#f2eeee', width: '100%' }} >
                    <div className="bg-white mt-2 d-flex justify-content-center">
                        <img src={image} alt="" className="img-thumbnail w-50 h-25 mb-2" />
                    </div>
                    <div className="mx-2 my-2">
                        <span className="px-2">Approx SMS: 1</span>
                        <span className="px-2">Approx Cost: {1 * initSmsCost}</span>
                    </div>
                </Box>
            </Col>
            <Col sm={1}>
                <i className="far fa-trash-alt mx-0" style={{ position: "absolute", top: "40%", fontSize: "1.5em" }} onClick={() => { deleteVideo(refIndex) }}></i>
            </Col>
        </Row>
    );
}

export default CreateImageVideo