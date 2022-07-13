import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import {Tooltip, Icon} from 'antd'


function LikeDislikes(props) {

  const [Likes, setLikes] = useState(0)
  const [DisLikes, setDisLikes] = useState(0)
  const [LikeAction, setLikeAction] = useState(null) 
  const [DisLikeAction, setDisLikeAction] = useState(null) 

  let variable = {}

  if(props.video) {
    variable = { videoId: props.videoId , userId: props.userId }
  }
  else{
    variable = {commentId: props.commentId, userId: props.userId}
  }

  useEffect(() => {
    Axios.post('/api/like/getLikes', variable)
    .then(response => {
        if(response.data.success){
            //좋아요 몇개 인지
            setLikes(response.data.likes.length) 

            //user가 좋아요를 눌렀는지
            response.data.likes.map(like => {
                if(like.userId === props.userId){
                    setLikeAction('liked')
                }
            })
        }else{
            alert('Likes에 정보를 가져올 수 없습니다')
        }
    })

    Axios.post('/api/like/getDislikes', variable)
    .then(response => {
        if(response.data.success){
            //좋아요 몇개 인지
            setDisLikes(response.data.dislikes.length) 

            //user가 좋아요를 눌렀는지
            response.data.dislikes.map(dislike => {
                if(dislike.userId === props.userId){
                    setDisLikeAction('disliked')
                }
            })
        }else{
            alert('DisLikes에 정보를 가져올 수 없습니다')
        }
    })
  }, [])
  
  const onLike = () => {
    if(LikeAction == null){
        Axios.post('/api/like/uplike', variable)
        .then(response => {
            if(response.data.success){
                setLikes(Likes + 1)
                setLikeAction('liked')

                if(DisLikeAction !== null){
                    setDisLikeAction(null)
                    setDisLikes(DisLikes - 1)
                }
            } else {
                alert("Like를 올리지 못하였습니다")
            }
        })
    } else {
        Axios.post('/api/like/unLike', variable)
        .then(response => {
            if(response.data.success){
                setLikes(Likes - 1)
                setLikeAction(null)
            } else {
                alert("Like를 내리지 못하였습니다")
            }
        })
    }
  }

  const onDisLike = () => {
    if(DisLikeAction == null){
        Axios.post('/api/like/upDisLike', variable)
        .then(response => {
            if(response.data.success){
                setDisLikes(DisLikes + 1)
                setDisLikeAction('disliked')

                if(LikeAction !== null){
                    setLikeAction(null)
                    setLikes(Likes - 1)
                }
            } else {
                alert("DisLike를 올리지 못하였습니다")
            }
        })
    } else {
        Axios.post('/api/like/unDisLike', variable)
        .then(response => {
            if(response.data.success){
                setDisLikes(DisLikes - 1)
                setDisLikeAction(null)
            } else {
                alert("DisLike를 내리지 못하였습니다")
            }
        })
    }
  }

  return (
    <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span> &nbsp; &nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{DisLikes}</span>
            </span>
    </div>
  )
}

export default LikeDislikes