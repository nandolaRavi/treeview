import React, { useCallback } from "react";
import { Button } from "react-bootstrap";
import { GrClose } from "react-icons/gr";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import './Terminal.css';
import { useDispatch } from "react-redux";
import { setInputMessage } from "../../redux/reducers/TreeViewSlice";
const Terminal = () => {
    const { curPath, terminalMessge } = useSelector((state) => state.treeView);
    const dispatch = useDispatch();
    const handleInput = useCallback((e) => {
        if (e.target.value === "") return;
        if (e.key !== "Enter") return;
        dispatch(setInputMessage({ value: e.target.value, path: curPath, isValidInput: false }));
        e.target.value = ''
    }, [dispatch, curPath]);

    return (
        <div className="main-body m-2 overflow-auto">
            <div className="header bg-black p-2">
                <div className="d-flex align-items-center justify-content-end">
                    <Link to='/'><Button className="bg-danger">
                        <GrClose className="fs-4 text-white" />
                    </Button>
                    </Link>
                </div>
            </div>

            <div className="mx-2 my-2">
                {terminalMessge.length > 0 && terminalMessge.map((item, index) => (
                    <div key={index}>
                        <div className="d-flex align-items-center">
                            <div>
                                <b><h6 className="text-success">{item.path}:~</h6></b>
                            </div>
                            <div className="mx-2">
                                <h6 className="text-white">{item.value.charAt(0).toUpperCase() + item.value.slice(1)}</h6>
                            </div>
                        </div>
                        {!item.isValidInput && <div className="mx-1">
                            <h6 className="text-white">{item.message}</h6>
                        </div>}
                        <hr className="text-white" />
                    </div>
                ))};
            </div>

            <div className="d-flex align-items-center">
                <div className="m-2">
                    <b><h6 className="text-white">{curPath}:~</h6></b>
                </div>
                <div>
                    <input onKeyPress={(e) => handleInput(e)} type='text' />
                </div>
            </div>
        </div>
    )
}

export default Terminal