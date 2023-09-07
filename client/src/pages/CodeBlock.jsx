import { useContext } from "react";
import { AutoContext } from "../context/AuthContext";
import { Container } from "react-bootstrap";

const CodeBlock = () => {

  const {codeBlock} = useContext(AutoContext);
console.log("codeBlock", codeBlock);

  return (
  
    <Container>
      <div className="CodeBlock">
          <header className="header-container">
              <h1> Welcome to {codeBlock?.title} code block!</h1>
          </header>
          <div className="body-container">
          {codeBlock ? (
              <div className="code-block">
              {codeBlock?.userCount === 1 ? (
                <h4>mentor user: read only</h4>
              ) : (
                <h4>student user: edit code </h4>
              )}
              <h2> {"Code Block title:"} {codeBlock?.title}</h2>
              <h2> {"Code:"} {codeBlock?.code}</h2>

            </div>
            ): 
            <div>{<p>No code block with this id...</p>}</div>
          }
        </div>
      </div>
    </Container>


  );

};
 
export default CodeBlock;