import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "shared/components/LoaderButton";
import "./Note.css";

function Note({ note, isLast, onAddReply }) {
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(null);
  function validateForm() {
    return true;
    return content.length > 0;
  }

  function saveNote(note) {
    return !!note.id
      ? API.put("notes", `/notes/${note.id}`, {
          body: note
        })
      : API.post("notes", "/notes", {
          body: note
        });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await saveNote({
        content: content,
        ...note
      });
      // props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <FormGroup controlId="content">
        <FormControl
          onChange={e => setContent(e.target.value)}
          value={content}
          componentClass="textarea"
        />
      </FormGroup>
      <LoaderButton
        block
        bsStyle="primary"
        bsSize="large"
        disabled={!validateForm()}
        type="submit"
        isLoading={isLoading}
        text="Save"
        loadingText="Saving…"
      />
      {isLast && (
        <LoaderButton
          block
          bsStyle="primary"
          bsSize="large"
          onClick={onAddReply}
          isLoading={isLoading}
          text="Reply"
          loadingText="Saving…"
        />
      )}
    </form>
  );
}

function Thread(props) {
  const [commentThread, setCommentThread] = useState([]);
  const [isReplying, setIsReplying] = useState(false);
  const replies = [];

  async function loadThread() {
    try {
      // const note = await getNote();
      const thread = await getThread();
      console.log(thread);

      setCommentThread(thread.sort((a, b) => a.createdAt - b.createdAt));
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {
    loadThread();
  }, []);

  function getThread() {
    return API.get("notes", `/notes/getThread/${props.match.params.id}`);
  }

  function handleAddReply() {
    setCommentThread([...commentThread, { parentId: commentThread[0].noteId }]);
  }

  return (
    <div className="Notes">
      {/* <>{note && <Note note={note} />}</> */}
      {commentThread.map((note, index) => (
        <Note
          key={note.id || index}
          note={note}
          isLast={index === commentThread.length - 1}
          onAddReply={handleAddReply}
        />
      ))}
    </div>
  );
}

export default Thread;
