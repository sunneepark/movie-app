import React, { useState } from 'react'
import { Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
    
const { TextArea } = Input;

function Comment(props) {
    const videoId = props.postId
    const user = useSelector(state => state.user); //redux 에서 user 정보를 가져옴.

    const [commentValue, setcommentValue] = useState("")
    const handleChange = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault(); //page refresh 를 막음
        
        const variables = {
            content: commentValue,
            writer: user.userData._id, //redux 를 이용하여 가져옴, 댓글 작성자
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setcommentValue("")
                    console.log(response.data.result)
                } else {
                    alert("comment can't save")
                }
        })
    }

  return (
      <div>
          <br />
          <p> Replies</p>
          <hr />

          {/** Comment Lists */}
          
          {/* Root Comment Form */}
          <form style={{ display: 'flex' }} onSubmit={onSubmit}>
              <TextArea
                  style={{ width: '100%', borderRadius: '5px' }}
                  onChange={handleChange}
                  value={commentValue}
                  placeholder="write some comments"
              />
              <br />
              <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
          </form>
    </div>
  )
}

export default Comment
