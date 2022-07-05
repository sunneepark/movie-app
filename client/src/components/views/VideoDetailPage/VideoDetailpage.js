import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscriber from './Sections/Subscriber'
import Comment from './Sections/Comment'

function VideoDetailpage(props) {
    const videoId = props.match.params.videoId
    const variable = {
        videoId: props.match.params.videoId
    }
    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오기 실패했습니다')
                }
        })
    })

    if (VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscriber userTo={VideoDetail.writer._id}/>
        return (
            <Row>
                <Col lg={18} xs={24}>
                    <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                        <List.Item
                            actions={[subscribeButton ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer && VideoDetail.writer.image} />}
                                title={<a href="https://ant.design">{VideoDetail.title}</a>}
                                description={VideoDetail.description}
                            />
                            <div></div>
                        </List.Item>
                        <Comment postId={videoId} />
                    </div>
                </Col>

                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>

            </Row>
      
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}

export default VideoDetailpage
