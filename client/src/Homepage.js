import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import trumpPicture from './trump.JPG'

export default class Homepage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            phrase: "Press a button to generate a phrase!",
            loading: false
        }
    }

    getFirstOrderPhrase = () => {
        this.setState({ loading: true })
        axios.get('https://flask-markov-api.herokuapp.com/firstOrderPhrase')
            .then(response => {
                const groomedResponse = response.data
                groomedResponse.charAt(0).toUpperCase() // capitalize first word in sentence
                
                this.setState({ phrase: groomedResponse, loading: false })
            })
            .catch(err => {
                this.getFirstOrderPhrase();
            })
    }

    getSecondOrderPhrase = () => {
        this.setState({ loading: true })
        axios.get('https://flask-markov-api.herokuapp.com/secondOrderPhrase')
            .then(response => {
                const groomedResponse = response.data
                groomedResponse.charAt(0).toUpperCase() // Capitalize first word in sentence
                console.log(groomedResponse.charAt(0))
                this.setState({ phrase: groomedResponse, loading: false })
            })
            .catch(error => {
                this.getSecondOrderPhrase()
            })
    }

    render() {
        return (
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1>Markov Trump Project</h1>
                    <h3 style={styles.subheader}>Generate random phrases from first and second order Markov Models trained with over 30,000 Trump tweets.</h3>
                    <p style={styles.subtext}>(No direspect to the POTUS, his tweets are just amazing).</p>
                    <div style={styles.linkContainer}>
                        <p><a href="#" style={styles.link}><FontAwesomeIcon style={styles.icon} icon={['fab', 'medium']} />No idea what's going on? Read my article on Medium!</a></p>
                        <p><a href="#" style={styles.link}><FontAwesomeIcon style={styles.icon} icon={['fab', 'github']} />Or, check out the repo for this code.</a></p>
                    </div>
                </header>
                {
                    this.state.loading
                    ? <div style={styles.phraseContainer}><p>Loading...</p></div>
                    : <div style={styles.phraseContainer}>
                            {
                                this.state.phrase
                                ? <p>{this.state.phrase}</p>
                                : <p>Oops! Something went wrong, please try again!</p>
                            }
                        </div>
                }
                <div style={styles.buttonContainer}>
                    <Button variant="contained" color="primary" onClick={() => this.getFirstOrderPhrase()}>Generate Phrase from First Order Model</Button>
                    <Button variant="contained" color="primary" onClick={() => this.getSecondOrderPhrase()}>Generate Phrase from Second Order Model</Button>
                </div>
            </div>
        )
    }
}
const styles = {
    container: {
        backgroundColor: 'rgb(51, 51, 51)',
        width: '100vw',
        backgroundSize: 'cover',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 200
    },
    header: {
        fontFamily: 'Arial',
        color: 'white',
        width: '80%',
        backgroundColor: 'rgba(255, 255, 255, .1)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        padding: 20,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    phraseContainer: {
        fontFamily: 'Arial',
        color: 'white',
        fontSize: 20,
        width: '80vw',
        height: '200px',
        padding: 20,
        margin: 20,
        backgroundColor: 'rgba(255, 255, 255, .1)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    subheader: {
        color: '#cecece'
    },
    subtext: {
        fontSize: 12,
        color: '#cecece'
    },
    link: {
        color: "white",
        fontSize: 13,
        textDecoration: 'none'
    },
    icon: {
        marginRight: 10,
    },
    linkContainer: {
        width: '50%',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, .1)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    },
    image: {
        maxWidth: 200,
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        margin: 10
    }
}