import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPortfolio } from './portfolioActions';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import PortfolioCard from './PortfolioCard';
import PortfolioChart from './PortfolioChart';
import StockListings from '../stock/StockListings';
import FundListings from '../funds/FundListings';
import FundForm from '../funds/FundForm';

export default function PortfolioPage() {
    const location = useLocation();
    const dispatch = useDispatch();
    const state = useSelector(state => state.portfolio.currentPortfolio);
    const [option, setOption] = useState('banking');

    useEffect(() => {
        dispatch(fetchPortfolio(location.state.portfolioId))
    }, [location.state.portfolioId, dispatch]);

    const handleClick = event => {
        setOption(event.currentTarget.value);
    }

    return (
        <Container className="mt-5">
            <Card>
                <PortfolioCard {...state} />
                    <Row className="justify-content-around">
                        <Button  
                            variant=''
                            className={
                                option === 'banking' ? 'selected' : 'portfolio-options'
                            } 
                            value='banking'
                            onClick={handleClick}
                        >
                            <h3 className='m-0'>
                                <i className="fas fa-landmark" />
                            </h3>
                        </Button>
                        <Button 
                            variant='' 
                            className={
                                option === 'chart' ? 'selected' : 'portfolio-options'
                            } 
                            value='chart'
                            onClick={handleClick}
                        >
                            <h3 className='m-0'>
                                <i className="fas fa-chart-pie"></i>
                            </h3>
                        </Button>
                        <Button 
                            variant='' 
                            className={
                                option === 'positions' ? 'selected' : 'portfolio-options'
                            } 
                            value='positions'
                            onClick={handleClick}
                        >
                            <h3 className='m-0'>
                                <i className="fas fa-chart-line"></i>
                            </h3>
                        </Button>
                        <Button 
                            variant='' 
                            className={
                                option === 'settings' ? 'selected' : 'portfolio-options'
                            } 
                            value='settings'
                            onClick={handleClick}
                        >
                            <h3 className='m-0'>
                                <i className="fas fa-cog"></i>
                            </h3>
                        </Button>
                    </Row>
                    <hr/>
                        
                <Container>
                    {option === 'banking' ? 
                    <Row>
                        <Col md={8}>
                            <FundListings />
                        </Col>
                        <Col md={4}>
                            <FundForm />
                        </Col>
                    </Row>
                    :
                    null
                    }
                    {option === 'chart' ? 
                    <Row>
                        <PortfolioChart />
                    </Row>
                    :
                    null
                    }
                    {option === 'positions' ? 
                    <Row>
                        <Col>
                            <StockListings />
                        </Col>
                    </Row>
                    :
                    null
                    }
                    {option === 'settings' ? 
                    <Row>
                        <Col>
                            {/* settings? */}
                        </Col>
                    </Row>
                    :
                    null
                    }
                </Container>
            </Card>
        </Container>
    )
}