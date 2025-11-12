import React from 'react';
import {Col, Row, Input} from "reactstrap";
import {siteURL} from "../../config/api";

const DemoGraphicLocation = ({mainTablecheckBoxValue,mainTableCheckBox,countries,tableCheckBox,tableCheckBoxValueList})=>{
    return (
        <Row>
            <Col xs={10} className="mx-auto">
                <Row>
                    <Col xs={3} className="d-flex align-items-center">
                        <Input type="checkbox" className="mr-2" checked={mainTablecheckBoxValue} onChange={() => mainTableCheckBox()}/>
                        Select All
                    </Col>
                </Row>
                <Row className="mt-3">
                    {
                        countries.map((v, i)=>{
                            if(i < 2){    
                                return (
                                    <Col xs={3} key={i} className="d-flex align-items-center">
                                        <Input type="checkbox" className="mr-2" checked={tableCheckBoxValueList.includes(v.id)} onChange={() => tableCheckBox(i, v.id)}/>
                                        <img src={siteURL+"/img/country_icon/"+v.iso2.toLowerCase()+".gif"} alt={v.countryName} className="mr-2"/>
                                        {v.countryName}
                                    </Col>
                                );
                            }else{
                                return null;
                            }
                        })
                    }
                </Row>
                <hr className="border-top-2 border-secondary"/>
                <Row>
                    {
                        countries.map((v, i)=>{
                            if(i >= 2){    
                                return (
                                    <Col xs={3} key={i} className="d-flex align-items-center">
                                        <Input type="checkbox" className="mr-2" checked={tableCheckBoxValueList.includes(v.id)} onChange={() => tableCheckBox(i, v.id)}/>
                                        <img src={siteURL+"/img/country_icon/"+v.iso2.toLowerCase()+".gif"} alt={v.countryName} className="mr-2"/>
                                        {v.countryName}
                                    </Col>
                                );
                            }else{
                                return null;
                            }
                        })
                    }
                </Row>
            </Col>
        </Row>
    );
}

export default DemoGraphicLocation;