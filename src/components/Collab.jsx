import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Noteitem } from "./Noteitem";

const socket = io("http://localhost:5000");

const Collab = (props) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [collabNotes, setCollabNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);

  // Fetch collab notes for the user
  useEffect(() => {
    fetch("http://localhost:5000/api/collab/mynotes", {
      headers: { "auth-token": localStorage.getItem("token") }
    })
      .then(res => res.json())
      .then(data => setCollabNotes(data));
  }, []);

  // Join socket room for active note
  useEffect(() => {
    if (activeNote) {
      socket.emit("join-collab-note", activeNote._id);
      setContent(activeNote.content || "");
      socket.on("collab-note-updated", (newContent) => {
        setContent(newContent);
      });
      return () => {
        socket.off("collab-note-updated");
      };
    }
  }, [activeNote]);

  // Invite collaborator and create note
  const handleInvite = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/collab/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ title, content, tag, email: inviteEmail })
    });
    const data = await res.json();
    if (data.error) {
      props.showAlert(data.error, "danger");
    } else {
      props.showAlert("Collab note created and invite sent!", "success");
      setCollabNotes([...collabNotes, data.note]);
      setTitle("");
      setContent("");
      setTag("");
      setInviteEmail("");
    }
  };

  // Edit collab note
  const editCollabNote = async (id, newTitle, newContent, newTag) => {
    const res = await fetch(`http://localhost:5000/api/collab/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ title: newTitle, content: newContent, tag: newTag })
    });
    const data = await res.json();
    if (data.success) {
      setCollabNotes(collabNotes.map(n => n._id === id ? data.note : n));
      props.showAlert("Changes saved successfully!", "success");
      socket.emit("edit-collab-note", { noteId: id, content: newContent });
    } else {
      props.showAlert(data.error || "Update failed", "danger");
    }
  };

  // Delete collab note
  const deleteCollabNote = async (id) => {
    const res = await fetch(`http://localhost:5000/api/collab/delete/${id}`, {
      method: "DELETE",
      headers: { "auth-token": localStorage.getItem("token") }
    });
    const data = await res.json();
    if (data.success) {
      setCollabNotes(collabNotes.filter(n => n._id !== id));
      props.showAlert("Note deleted successfully!", "success");
      if (activeNote && activeNote._id === id) setActiveNote(null);
    } else {
      props.showAlert(data.error || "Delete failed", "danger");
    }
  };

  // Handle content change and emit to socket
  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (activeNote) {
      socket.emit("edit-collab-note", { noteId: activeNote._id, content: e.target.value });
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="text-center">Collab</h1>
      <form className="mb-4" onSubmit={handleInvite}>
        <div className="row">
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Note Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-2">
            <textarea
              className="form-control"
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={2}
              required
            />
          </div>
          <div className="col-md-2 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tag"
              value={tag}
              onChange={e => setTag(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="email"
              className="form-control"
              placeholder="Collaborator Email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-info mt-2">Invite & Create</button>
      </form>
      <div>
        <h4>Your Collab Notes</h4>
        <div className="d-flex flex-wrap" style={{ gap: "24px" }}>
          {collabNotes.length === 0 && <div>No collab notes yet.</div>}
          {collabNotes.map(note => (
            <Noteitem
              key={note._id}
              note={note}
              updateNote={() => setActiveNote(note)}
              showAlert={props.showAlert}
              editNote={(id, title, description, tag) => editCollabNote(id, title, description, tag)}
              deleteNote={deleteCollabNote}
            />
          ))}
        </div>
      </div>
      {activeNote && (
        <div className="mt-4">
          <h4>Edit Collab Note: {activeNote.title}</h4>
          <textarea
            className="form-control"
            rows={10}
            value={content}
            onChange={handleContentChange}
            style={{ color: "#fff", background: "#232526" }}
            placeholder="Start collaborating..."
          />
          <button
            className="btn btn-primary mt-2"
            onClick={() =>
              editCollabNote(activeNote._id, activeNote.title, content, activeNote.tag)
            }
          >
            Save Changes
          </button>
          <button
            className="btn btn-danger mt-2 ms-2"
            onClick={() => deleteCollabNote(activeNote._id)}
          >
            Delete Note
          </button>
        </div>
      )}
    </div>
  );
};


export default Collab;
