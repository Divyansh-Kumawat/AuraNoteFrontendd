import React, { useContext, useState } from 'react'
import noteContext from "../context/Notes/noteContext"

export const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;

    const [showModal, setShowModal] = useState(false);

    const handleReadMode = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className="col-md-3">
                <div
                    className="card my-3"
                    style={{
                        cursor: "pointer",
                        minWidth: "280px",
                        maxWidth: "100%",
                        width: "320px"
                    }}
                    onClick={handleReadMode}
                >
                    <div className="card-body">
                        <div className="d-flex align-items-center mx-2">
                            <h5
                                className="card-title text-truncate"
                                style={{
                                    maxWidth: "160px",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    marginBottom: 0
                                }}
                                title={note.title}
                            >
                                {note.title}
                            </h5>
                            <i className="fa-solid fa-pen-to-square mx-1" onClick={(e) => { e.stopPropagation(); updateNote(note); }}></i>
                            <i className="fa-solid fa-trash mx-1" onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note._id);
                                props.showAlert("Deleted successfully", "success")
                            }}></i>
                        </div>
                        <p className="card-text">{note.description}</p>
                    </div>
                </div>
            </div>
            {/* Reading Mode Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.7)" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ background: "#232526", color: "#e3f6fd" }}>
                            <div className="modal-header">
                                <h5 className="modal-title">{note.title}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                    
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>{note.description}</p>
                                <p><strong>Tag:</strong> {note.tag}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Noteitem
