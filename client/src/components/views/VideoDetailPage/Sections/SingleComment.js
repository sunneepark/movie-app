import React, {useState} from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user); //redux 에서 user 정보를 가져옴.

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    
    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id, //redux 를 이용하여 가져옴, 댓글 작성자
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                } else {
                    alert("comment can't save")
                }
            })
    }
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }
    const actions = [
        <LikeDislikes commentId={props.comment._id} userId={localStorage.getItem('userId')}/>
        ,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to</span>
    ]

  return (
    <div>
          <Comment
              actions={actions}
              author
              avatar={<Avatar src alt />}
              content={<p>{props.comment.content}</p>}
          />

          {OpenReply && 
              <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                  <TextArea
                      style={{ width: '100%', borderRadius: '5px' }}
                      onChange={onHandleChange}
                      value={CommentValue}
                      placeholder="write some comments"
                  />
                  <br />
                  <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>
              </form>
          }
          
    </div>
  )
}

export default SingleComment
