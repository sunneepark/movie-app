import { Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { FaCode, FaRocketchat } from "react-icons/fa";
import { API_KEY, API_URL, IMAGE_BASE_URL } from "../../Config"
import GridCards from '../commons/GridCards';
import MainImage from './Sections/MainImage';

function LandingPage() {

    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [CurrentPage, setCurrentPage] = useState(0)

    const fetchMovies = (endpoint) => {
      fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setMovies([...Movies, ...response.results])
        setMainMovieImage(response.results[0])
        setCurrentPage(response.page)
      })
    }

    useEffect(() => {
      
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)

    }, [])
    
    

    const loadMoreItems = () => {
        
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        fetchMovies(endpoint)

    }

    return (
        <div style={{ width: '100%', margin: '0'}}>
            
            {MainMovieImage && 
                <MainImage 
                image={`${IMAGE_BASE_URL}w1280${MainMovieImage.backdrop_path}`}
                title={MainMovieImage.original_title}
                text={MainMovieImage.overview}
                />
            }
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <h2>Movies by latest</h2>
                <hr/>

                <Row gutter={[16, 16]}>

                    {Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                             <GridCards
                                landingPage
                                image={movie.poster_path ? 
                                `${IMAGE_BASE_URL}w500${movie.poster_path}` : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                             />
                        </React.Fragment>
                    ))}
                </Row>
                
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={ loadMoreItems }>Load More</button> 
            </div>
        </div>
    )
}

export default LandingPage
