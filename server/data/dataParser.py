import csv
import json
import numpy as np

clean_data = []

# *************************************
# Get a valid array of text that we can train our model with
# *************************************
def pruneLine(line):
    strippedLine = []
    if(len(line) > 0):
        # Ignore any tweets of Donald Trump quoting other people, we only want to train our model based on things that have actually
        # come out of his mouth.
        if(line[0][0] != '"'):
            txt = line[0].split()
            for word in txt:
                cleanWord = getValidWord(word)
                if(cleanWord != False):
                    if(type(cleanWord) is list):
                        for item in cleanWord:
                            strippedLine.append(item)
                    else:
                        strippedLine.append(cleanWord)
        return strippedLine
    else:
        return False # Love that I can hvae two different return types for this function. Fuck. Yes. Python.

# *************************************
# Blacklist for words that we don't want - links, mentions, ect. As well as lowercase words and separate from punctuation marks.
# *************************************
def getValidWord(word):
    if(word[0] == '@'): # ignore mentions
        return False
    elif(word[:4] == "http"): # ingnore links
        return False
    elif(word == 'J.' or word == "j." or word == "Donald" or word == "Trump"): # we don't need to include his twitter signature in our model
        return False
    elif(word[len(word) - 1] == "." or word[len(word) - 1] == "!" or word[len(word) - 1] == "?"):
        # separating end of sentence words from their punctuation because we actually want to treat punctuation as it's own word
        # The reason for this is because when we are generating sentences, we will want to terminate the generation when we encounter a puctuation mark.
        punctuation = word[len(word) - 1]
        word = word[:(len(word) - 1)].lower() # <-- don't forget to lowercase
        return [word, punctuation]
    else:
        return word.lower() #lowercase that shit

# *************************************
# Train the second order markov model.
# *************************************
def generateSecondOrderMarkov(cleanData):
    markov_model = {} # <-- this will be a nested dicitonary
    for line in cleanData:
        for i in range(0, len(line) - 1):
            # first, check and see if the unique word has already been added to our model
            if(line[i] in markov_model):
                #now, check to see if the next word has already been recorded in transition words
                if(line[i+1] in markov_model[line[i]]):
                    markov_model[line[i]][line[i+1]] += 1
                else:
                    markov_model[line[i]][line[i+1]] = 1
            else:
                markov_model[line[i]] = {}
                markov_model[line[i]][line[i+1]] = 1
    return markov_model

# *************************************
# Create a dictionary that allows us to see how many times a word occured
# *************************************
def generateDictionary(cleanData):
    word_occurences = {}
    for line in cleanData:
        for word in line:
            if(word in word_occurences):
                word_occurences[word] += 1
            else:
                word_occurences[word] = 1

    return word_occurences

# *************************************
# Normalize the second order markov model.
# *************************************
def normalizeSecondOrder(markov_model, word_occurences):
    for word in markov_model:
        for transition_word in markov_model[word]:
            markov_model[word][transition_word] = markov_model[word][transition_word]/word_occurences[word]
    return markov_model


# *************************************
# Read the file and clean the data so we can work with it.
# *************************************
with open('./trumpTweets.csv') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for line in spamreader:
        # Lets go ahead and get rid of all the quoted text by donald trump, we really only just want the things that he has said
        if(len(line) > 0):
            if(line[0][0] != '"'):
                pruned_line = pruneLine(line)
                clean_data.append(pruned_line)


second_order_markov = generateSecondOrderMarkov(clean_data)
word_occurences = generateDictionary(clean_data)
normalized_second_order = normalizeSecondOrder(second_order_markov, word_occurences)

print(normalized_second_order['just'])

# export = 'module.exports = '
# markov_json = json.dumps(normalized_second_order)

# f = open("second_order_markov.json", "w")
# f.write(export + markov_json)      
