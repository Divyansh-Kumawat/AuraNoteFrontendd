import NoteContext from "./noteContext";
import { useState } from "react";
const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)
    //get all notes
    const getNotes = async () => {
        //API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json()
        console.log(json)
        // Ensure notes is always an array
        setNotes(Array.isArray(json) ? json : [])
    }
    //add a note
    const addNote = async (title, description, tag) => {
        //API call
        // eslint-disable-next-line
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            // Automatically converted to "username=example&password=password"
            body: JSON.stringify({ title, description, tag })
            // …
        });
        const note= await response.json();
       
        setNotes(notes.concat(note))

    }
    //delete a note
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },

        });
        const json = await response.json(); // <-- add await here
        console.log(json)
        console.log("deleting the node with ID" + id)
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);

    }
    //edit a note
    const editNote = async (id, title, description, tag) => {
        // API CALL 
        // eslint-disable-next-line
        const response = await fetch(`${host}/api/notes/update/${id}`, {
            
            method: "PUT",
            headers: {
                "Content-Type": "application/json", 
                "auth-token": localStorage.getItem('token')
            },
            // Automatically converted to "username=example&password=password"
            body: JSON.stringify({ title, description, tag })
            // …
        });
        const json= await response.json();
        console.log(json);
        //new cannot update the notes directly in the react so we use stringfy and then parse it to update the notes and use the new notes variable
        let newNotes=JSON.parse(JSON.stringify(notes))
        //logic to edit in client
        for (let index = 0; index < notes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
            
        }
        setNotes(newNotes);
    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;