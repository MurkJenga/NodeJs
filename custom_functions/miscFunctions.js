function createdEmbed(hex, title, desc) {
    return {
        color: parseInt(hex, 16), 
        title: title,
        description: desc
    } 
}

function randomReply() {
    const responses = [
        'Milk, milk, lemonade, \'round the corner fudge is made', 
        'She gave me a rimjob', 
        'Now both of them can call me \'daddy\'', 
        'I be destroying her ass', 
        'I bang her harder than a screen door in a hurricane', 
        'She know who really gives it to her good', 
        'Best door mat I\'ve ever found on the side of the road', 
        'I\'ve been considering a better model lately', 
        'Should be illegal for ass to be that easy',
        'I fucked her like Heath Ledger fucked Jake Gyllenhaal in Brokeback Mountain.']
    const randomIndex = Math.floor(Math.random() * responses.length);
    
    return responses[randomIndex]
}

module.exports = { createdEmbed, randomReply }