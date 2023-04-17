import { Amplify } from 'aws-amplify';

import { API, graphqlOperation } from 'aws-amplify';
import { Storage } from "aws-amplify";
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState } from "react";
import awsExports from './aws-exports';
import { useEffect } from 'react';
Amplify.configure(awsExports);



export default function App() {

  const [fileData, setFileData] = useState();
  const [fileName, setFileName] = useState();
  const [fileStatus, setFileStatus] = useState(false);
  // const [signedURL, setSignedURL]=useState();
  const uploadFile = async () => {
    const result = await Storage.put(fileData.name, fileData, {
      contentType: fileData.type,
    });
    setFileStatus(true);
    const s3url = await Storage.get(fileData.name, { download: true });
    // setSignedURL(Storage.get(fileData.name));
    console.log(21, result);
    console.log(22, fileData.name);
    console.log(23, Storage.bucketName);
    
    const todo = { inputText: fileName, inputPath: "s3://fileupload4ff7c65cf0ab4ddf8b51fee129b59a32141136-dev/public/"+fileData.name };

      /* create a todo */
    await API.graphql(graphqlOperation(createTodo, {input: todo}));
  };




  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <br></br>
          <br></br>
          <div>
            <label>
              Input:{" "}
              <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </label>
          </div>
          <br></br>
          <div>
            <input type="file" onChange={(e) => setFileData(e.target.files[0])} />
          </div>
          <br></br>
          <div>
            <button onClick={uploadFile}>Upload file</button>
          </div>
          {fileStatus ? "File uploaded successfully" : ""} 
          
        </main>
      )}
    </Authenticator>
  );
}