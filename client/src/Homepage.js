import React from 'react';
import Button from '@material-ui/core/Button';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            phrase: "Press a button to generate a phrase!"
        }
    }

    getFirstOrderPhrase = () => {
        console.log('Get first order phrase')
        fetch('https://flask-markov.herokuapp.com/firstOrderPhrase')
            .then((response) => this.setState({ phrase: response }))
            .catch((error) => {
                console.error(error)
                this.setState({ phrase: 'Oops! There was a problem please try again! '})
            })
    }

    getSecondOrderPhrase = () => {
        console.log('Get second order phrase')
        fetch('https://flask-markov.herokuapp.com/secondOrderPhrase')
            .then((response) => this.setState({ phrase: response }))
            .catch((error) => {
                console.error(error)
                this.setState({ phrase: 'Oops! There was a problem please try again! '})
            })
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.phraseContainer}>
                    {
                        this.state.phrase
                        ? <p>{this.state.phrase}</p>
                        : <p>Oops! Something went wrong, please try again!</p>
                    }
                </div>
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
        color: 'red',
        backgroundSize: 'cover',
        overflow: 'hidden',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    phraseContainer: {

    }
}