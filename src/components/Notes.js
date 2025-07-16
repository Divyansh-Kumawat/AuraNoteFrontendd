import React, { useContext, useEffect, useRef,useState } from 'react'
import noteContext from "../context/Notes/noteContext"
import { Noteitem } from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';     

export const Notes = (props) => {

    const context = useContext(noteContext);
  const navigate = useNavigate();                  
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login", { replace: true });
  } else {
    getNotes();
  }
  // eslint-disable-next-line
}, []);
    const ref = useRef(null);
    const refClose=useRef(null);
    const [note, setnote] = useState({id:"", etitle:"",edescription :"", etag:"default"})
    const updateNote = (currentNote) => {
        ref.current.click();
        setnote({id:currentNote._id, etitle: currentNote.title,edescription: currentNote.description,etag: currentNote.tag})
        
    }
    const handleClick=(e)=>{
        console.log("updating note")
        editNote(note.id,note.etitle,note.edescription,note.etag)
        refClose.current.click();
        props.showAlert("Updated successfully", "success")
    }
    const onChange=(e)=>{
        setnote({...note, [e.target.name]:e.target.value})
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button type="button" ref={ref} className="btn btn-primary my-3 d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={handleClick} type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3"><h2>Your Notes</h2>
                {notes.length===0 && 'No notes to Display'}
                {notes.map((note) => {
                    return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
                })}
            </div>
        </>
    )
}
export default Notes
