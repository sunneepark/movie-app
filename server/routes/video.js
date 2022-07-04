const express = require('express');
const router = express.Router();

const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');

var storage = multer.diskStorage({
    destination: (req, file, cb) => { //파일을 저장하는 곳
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') { //mp4 형식만 올릴 수 있음
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file");


router.post('/uploadfiles', (req, res) => {

    //비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({success:false, err})
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })
})

router.post('/thumbnail', (req, res) => {
    
    let thumbsFilePath = "";
    let fileDuration = "";

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
        console.dir(metadata); //all metadata
        fileDuration = metadata.format.duration;
    })

    //썸네일 생성
    ffmpeg(req.body.filePath)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration })
        })
        .on('error', function (err) {
            return res.json({ success: false, err });
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            // %b input basename ( filename w/o extension )
            filename: 'thumbnail-%b.png'
        });

})

router.post('/uploadVideo', (req, res) => {

    //업로드한 정보를 db에 저장
    const video = new Video(req.body)
    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success:true })
    })
})

router.get('/getVideos', (req, res) => {
    Video.find()
        .populate('writer') //모든 User 정보를 가져올 수 있음. 만약 writer만 가져오면 objectid 만 가져오게됨
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
})

router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id": req.body.videoId })
        .populate('writer') //모든 User 정보를 가져올 수 있음. 만약 writer만 가져오면 objectid 만 가져오게됨
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videoDetail })
        })
})

router.post('/getSubscriptionVideos', (req, res) => {
    
    //1. 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            let subscribedUser = [];
            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })

            //2. 찾은 사람들의 비디오를 가지고 온다
            Video.find({ writer: { $in: subscribedUser} })
                .populate('writer') //모든 User 정보를 가져올 수 있음. 만약 writer만 가져오면 objectid 만 가져오게됨
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, videos })
                })
            
        })
    
    
})

module.exports = router;