import { useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { mergeDir, replaseDir } from "../redux/reducers/TreeViewSlice";
const AlertModal = (props) => {
    const dispatch = useDispatch();

    const handleMerge = useCallback(() => {
        dispatch(mergeDir());
    }, [dispatch]);

    const handleRepalse = useCallback(() => {
        dispatch(replaseDir())
    }, [dispatch]);

    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    paste
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>
                    File or folder already exist on destination path,
                </h4>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleMerge()} className='btn btn-primary'>Mareg</Button>
                <Button onClick={handleRepalse()} className='btn btn-secondary'>Replase</Button>

            </Modal.Footer>
        </Modal>
    );
}
export default AlertModal