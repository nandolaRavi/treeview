import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

function AlertModal(props) {
    const isConflict = useSelector((state) => state.treeView.isConflict);

    const onMarge = () => {

    }
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    paste
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => onMarge()}>Mareg</Button>
                <Button onClick={props.onHide}>replase</Button>

            </Modal.Footer>
        </Modal>
    );
}
export default AlertModal