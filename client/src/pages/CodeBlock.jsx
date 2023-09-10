import { useContext, useState, useEffect } from "react";
import { AutoContext } from "../context/AuthContext";
import { Link } from "react-router-dom"
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import smiley_face from "../asserts/smiley_face.svg"

const server_url = "https://online-coding-web-app-api.vercel.app";

const CodeBlock = () => {

  const {codeBlock} = useContext(AutoContext);
  const [userType, setUserType] = useState(null);
  const [code, setCode] = useState(null);
  const [solution, setSolution] = useState(null);
  const [title, setTitle] = useState(null);
  const [codeValue, setCodeValue] = useState(null);
  const [userId] = useState(Math.floor(Math.random() * 100000));
  const [rightAnswer, setRightAnswer] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [socketEdit, setSocketEdit] = useState();

  const updateCodeBlock = (newCodeBlock) => {
    setSolution(newCodeBlock.solution);
    setCode(newCodeBlock.code);
    setTitle(newCodeBlock.title);

}

  useEffect(() => {
    const socket = io(server_url);
    setSocketEdit(socket);

    socket.on("connect", () => {
      updateCodeBlock(codeBlock);

      socket.emit("send-code-block-title", {
        codeBlockTitle: title,
        userId: userId,
        codeBlock: codeBlock
      });
    });

    socket.on("receive-codeBlock", (data) => {
      if (!data) return;
        if (userType) return;
        setUserType({
          user: data.user,
          isMentor: data.isMentor,
        });
    });

    socket.on("solve-exercise", () => {
      setRightAnswer(true);
    });

    socket.on("receive-changes", (newCode) => {
      if (!newCode) return;
      if (userType?.isMentor) {
        setCodeValue(newCode);
      }
    });

    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on("disconnect", () => {
      console.log("server disconnected");
    });
    return () => {
      socket.emit("remove-user", { codeBlockTitle: title, userId: userId });
      socket.disconnect();
    };
  }, [codeBlock, title, userId, userType]);

  const checkCodeblock = () => {

    if (code.replace(/\s+/g, '') === solution.replace(/\s+/g, '')) {
      setRightAnswer(true);
      setWrongAnswer(false);
      socketEdit.emit("correct-answer", title);
    } else{
      setRightAnswer(false);
      setWrongAnswer(true);
    }
  };

  const handleEditorChange = (codeValue) => {
    setCode(codeValue);
    socketEdit.emit("send-changes", { title, code: codeValue });
  };

  return (
    <>
      {codeBlock ? (
        <>
          <div className="codeBlock-container">
            <div className="codeBlock-title">
              <h1> Welcome to {codeBlock?.title} code block!</h1>
            </div>
            {rightAnswer ? (
              <div className="correct-answer">
                <img src={smiley_face} width="300" alt="smile picture" />
                <h2>Correct answer, good job</h2>
                <Link to={"/"}>
                  <button className="btn correct-btn">
                    <h4>Check out more exercises</h4>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="editor">

                {userType?.isMentor ? (
                  <h4>mentor user: read only</h4>
                ) : (
                  <h4>student user: edit code <br /><br />
                    Try to fix the code :</h4>

                )}
                <div className="editor-container">
                  <Editor
                    options={{ readOnly: userType?.isMentor }}
                    theme="vs-dark"
                    height="300px"
                    width="80%"
                    onChange={handleEditorChange}
                    value={codeValue ? codeValue : code}
                    defaultLanguage="javascript"
                    defaultValue={code}
                  />
                </div>
                <div className="check-code-btn">
                    {userType?.isMentor ? (
                      null
                    ) : (
                      <button
                      onClick={checkCodeblock}>
                      check code
                    </button>
                    )}
                    <Link to={"/"}>
                      <button className="btn correct-btn">
                        <h4>Check out more exercises</h4>
                      </button>
                    </Link>
                  <div>
                    {wrongAnswer ? (
                    <h4 className="Wrong-Answer-title">
                      Wrong answer, try again
                    </h4>
                  ) : null}

                  </div>
                </div>

              </div>
            )}
          </div>
        </>
      ) : (
        "loading"
      )}
    </>
  );

};
 
export default CodeBlock;