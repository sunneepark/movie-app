const express = require('express');
const { Favorite } = require('../models/Favorite');
const router = express.Router();


//=================================
//             Favorite
//=================================

router.post("/favoriteNumber", (req, res) => {

    //mongoDb에서 favorite 숫자를 가져오기 
    // 숫자 정보 client 로 보내주기

    Favorite.find({ "movieId": req.body.movieId })
    .exec((err, info) => {
        if(err) return res.status(400).send(err)

        res.status(200).json({
            success: true,
            favoriteNumber: info.length
        })
    })
   
});

router.post("/favorited", (req, res) => {

    //로그인한 유저가 해당 영화를 favorite 리스트에 넣었는지
    //여부를 client 로 보내주기

    Favorite.find({ "movieId": req.body.movieId, "userFrom": req.body.userFrom })
    .exec((err, info) => {
        if(err) return res.status(400).send(err)
        
        let result = false;
        if(info.length != 0){
            result = true
        }
        res.status(200).json({
            success: true,
            favorited: result
        })
    })
   
});

router.post('/removeFromFavorite', (req, res) => {
    Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, doc })
        })

})


router.post('/addToFavorite', (req, res) => {

    const favorite = new Favorite(req.body)

    favorite.save((err, doc) => {
        if (err) return res.status(400).send(err)
        return res.status(200).json({ success: true })
    })

})

router.post('/getFavoredMovie', (req, res) => {

    Favorite.find({ "userFrom": req.body.userFrom })
    .exec((err, favorites) => {
        if(err) return res.status(400).send(err)
        return res.status(200).json({ success: true, favorites })
    })
   

})



module.exports = router;
