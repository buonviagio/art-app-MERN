import { FormEvent, useContext, useEffect, useState } from "react";
import "./CommentSection.css";
import { Alert, Button, Form } from "react-bootstrap";
import { CommentsResponce } from "../../types/customType";
import { AuthContext } from "../../context/AuthContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AccountCircle } from "@mui/icons-material";
import { GoPencil } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";

type CommentsSectionProps = {
  artditail: string;
};
function CommentsSection({ artditail }: CommentsSectionProps) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState<CommentsResponce[]>([]);
  const [newComment, setNewComment] = useState("");
  //two varriables below for changing comment
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [alert, setAlert] = useState(false);

  const handleEditButtonClick = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (editText.trim()) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const urlencoded = new URLSearchParams();
        urlencoded.append("text", editText);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
        };

        const response = await fetch(
          `http://localhost:5000/api/comments/change/${commentId}`,
          requestOptions
        );
        if (response.ok) {
          setEditingCommentId(null);
          getAllComentsForArtObject();
        }
      } else {
        console.log("you have to write some text");
      }
    } catch (error) {
      console.log("error, we can not to change comment :>> ", error);
    }
  };

  const getAllComentsForArtObject = async () => {
    try {
      const requestOptions = {
        method: "GET",
      };

      const response = await fetch(
        `http://localhost:5000/api/comments/${artditail}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setComments(result.comments);
      } else {
        console.log("there are any comments for this art object ");
      }
    } catch (error) {
      console.log(
        "error, we can not recieve comments for this art object :>> ",
        error
      );
    }
  };

  useEffect(() => {
    getAllComentsForArtObject();
  }, []);

  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAlert(false);

    if (!user.userId) {
      setNewComment("");
      setAlert(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      if (newComment.trim()) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const urlencoded = new URLSearchParams();
        urlencoded.append("text", newComment);

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
        };

        const response = await fetch(
          `http://localhost:5000/api/comments/${artditail}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          const newUserComment: CommentsResponce = {
            artId: result.artId,
            text: result.text,
            userId: result.userId,
            avatar: user.avatar?.secure_url,
            userName: user.userName,
            createdAt: result.createdAt,
            commentId: result.commentId,
            updatedAt: result.createdAt,
          };
          setComments([...comments, newUserComment]);
          setNewComment("");
        }
      } else {
        console.log("you have to write something");
      }
    } catch (error) {
      console.log("error to add comment :>> ", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const urlencoded = new URLSearchParams();

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      const response = await fetch(
        `http://localhost:5000/api/comments/delete/${commentId}`,
        requestOptions
      );
      if (response.ok) {
        //const resolt = await response.json();
        getAllComentsForArtObject();
      }
    } catch (error) {
      console.log("error, comment wasn't deleted :>> ", error);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {alert && (
        <Alert
          variant={"primary"}
          style={{
            width: "80%",
            margin: "2rem auto",
          }}
        >
          {"To leave a comment, you need to rogin"}
        </Alert>
      )}
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group className="mb-3" controlId="commentText">
          <Form.Label>Write a Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Comment
        </Button>
      </Form>
      <div className="comments-list mt-4">
        {comments.length ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header d-flex align-items-center">
                <div className="profile-icon me-2">
                  {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt="Profile"
                      className="profile-picture"
                    />
                  ) : (
                    <AccountCircle fontSize="large" sx={{ color: "#66ccff" }} />
                  )}
                </div>

                <span className="comment-username fw-bold">
                  {user.userId === comment.userId
                    ? "You wrote this comment"
                    : comment.userName}
                </span>
              </div>
              <p className="comment-date text-muted">
                Posted on: {new Date(comment.createdAt).toLocaleDateString()}
                {comment.updatedAt !== comment.createdAt &&
                  ` Last update:  ${new Date(
                    comment.updatedAt
                  ).toLocaleDateString()}`}
              </p>

              {/* Conditional Rendering for Comment Text or Textarea */}
              {editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    // style={{ width: "100%" }}
                    className="form-control"
                  />
                  <button
                    className="custom-button save-button"
                    onClick={() => handleUpdateComment(comment.commentId)}
                  >
                    <GrUpdate size={25} />
                  </button>
                  <button
                    className="custom-button cancel-button"
                    onClick={() => setEditingCommentId(null)}
                  >
                    <MdOutlineCancel size={30} />
                  </button>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
              {/* The end of the conditional Rendering for Comment Text or Textarea */}
              {user.userId === comment.userId && (
                <div className="comment-actions">
                  <button
                    className="custom-button delete-button"
                    onClick={() => {
                      handleDeleteComment(comment.commentId);
                    }}
                  >
                    <RiDeleteBin6Line size={30} />
                  </button>

                  <button
                    className="custom-button edit-button"
                    onClick={() => {
                      handleEditButtonClick(comment.commentId, comment.text);
                    }}
                  >
                    <GoPencil size={30} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
