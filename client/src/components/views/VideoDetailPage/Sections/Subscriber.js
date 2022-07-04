import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {
  const [SubscribeNumber, setSubcribeNumber ] = useState(0)
  const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
      let variable = { userTo: props.userTo }
      Axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response => {
          if (response.data.success) {
            setSubcribeNumber(response.data.subscribeNumber)
          } else {
            alert('구독자 수 정보를 가져오지 못했습니다.')
          }
        })
      
      let subscribedvariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }
      Axios.post('/api/subscribe/subscribed', subscribedvariable)
        .then(response => {
          if (response.data.success) {
            setSubscribed(response.data.subcribed)
          } else {
            alert('정보를 받아오지 못했습니다')
          }
      })
    }, [])
  
  const onSubscribe = () => {
    let subescribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem('userId')
    }
    //이미 구독중이라면
    if (Subscribed) {
      Axios.post('/api/subscribe/unSubscribe', subescribedVariable)
        .then(response => {
          if (response.data.success) {
            setSubcribeNumber(SubscribeNumber - 1)
            setSubscribed(false)
          } else {
            alert('구독 취소 하는데 실패했습니다')
          }
      })
    //아직 구독중이 아니라면
    } else {
      Axios.post('/api/subscribe/subscribe', subescribedVariable)
        .then(response => {
          if (response.data.success) {
            setSubcribeNumber(SubscribeNumber + 1)
            setSubscribed(true)
          } else {
            alert('구독 하는데 실패했습니다')
          }
        })
    }
  }
  
  return (
    <div>
      <button 
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
          borderRadius: '4px', color: 'white',
          padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
        }}>
        {SubscribeNumber} {Subscribed ? 'Subscribed':'Subscribe'}
          </button>
    </div>
  )
}

export default Subscribe
