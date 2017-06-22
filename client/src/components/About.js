import React from 'react';
//import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

const About = props => {
  return (
    <Container>
      <Row>
        <Col xs="12" md={{ size: 8, offset: '2' }}>
          <div style={{ marginTop: '15px' }}>
            <h3
              className="text-center"
              style={{
                color: '#C17DBF',
                marginBottom: '15px',
                textDecoration: 'underline darkgrey'
              }}
            >
              About the App
            </h3>
          </div>
          <div>
            <p>
              <span style={{ color: '#C17DBF', fontWeight: '500' }}>Julie</span>
              {' '}
              is an itinerary planner for people who have never heard of Google, Yelp, Foursquare, TravelPlanner, and probably like 40 others.
            </p>
            <p>
              Technology used: NodeJS, React, Redux, MongoDB, Mongoose, Bootstrap, Google API, Foursquare API
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs="12" md={{ size: 8, offset: '2' }}>
          <div>
            <h3
              className="text-center"
              style={{
                color: '#C17DBF',
                marginBottom: '15px',
                textDecoration: 'underline darkgrey'
              }}
            >
              Developed By
            </h3>
          </div>
          <div>
            <h5 style={{ marginBottom: '0px' }}>
              Egle Libby
            </h5>
            <span style={{ fontSize: '14px' }}>
              <a href="http://www.linkedin.com/in/egle-libby/"> LinkedIn </a> /
              <a href="https://github.com/eglital"> GitHub </a> /
              <a href="http://www.eglelibby.com/"> Personal Site </a>
            </span>
            <p>
              Egle is the destroyer of worlds and collects keychains in her spare time.
            </p>
          </div>

          <div>
            <h5 style={{ marginBottom: '0px' }}>
              Nicholas Romeo
            </h5>
            <span style={{ fontSize: '14px' }}>
              <a href="http://www.linkedin.com/in/romeonicholas/"> LinkedIn </a>
              {' '}
              /
              <a href="https://github.com/Throw22"> GitHub </a> /
              <a href="https://throw22.github.io/"> Personal Site </a>
            </span>
            <p>
              Nicholas cannot get these kids to stay off of his lawn.
            </p>
          </div>

          <div>
            <h5 style={{ marginBottom: '0px' }}>
              Renzo Tomlinson
            </h5>
            <span style={{ fontSize: '14px' }}>
              <a href="http://www.linkedin.com/in/renzo-tomlinson-rd-5313481b/">
                {' '}LinkedIn{' '}
              </a>
              {' '}
              /
              <a href="https://github.com/rttomlinson"> GitHub </a> /
              <a href="https://rttomlinson.heroku.com"> Personal Site </a>
            </span>
            <p style={{ marginTop: '5px' }}>
              Renzo will not. Don't ask him.
            </p>
          </div>

          <div>
            <h5 style={{ marginBottom: '0px' }}>
              William Whitworth
            </h5>
            <span style={{ fontSize: '14px' }}>
              <a href="http://www.linkedin.com/in/william-whitworth-20007329/">
                {' '}LinkedIn{' '}
              </a>
              {' '}
              /
              <a href="https://github.com/William-Charles"> GitHub </a> /
              <a href="https://william-charles.github.io/williamwhitworth/">
                {' '}Personal Site{' '}
              </a>
            </span>
            <p>
              William is not the famous music producer will.i.am and frankly we all feel a little deceived.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
//252,83, 132
export default About;
