describe("incrementRound", function() {
  it("increment a number passed by 1", function() {
    chai.expect(incrementRound(3)).to.equal(4);
  });

  it("increment 0 by 1", function() {
    chai.expect(incrementRound(0)).to.equal(1);
  });
});

let data = {
  id: 4,
  round: 5
};

describe("setGameState", function() {
  it("returns the default gameState object", function() {
    chai.expect(setGameState(data)).to.deep.equal({id: 4, round: 0, players: []});
  });
});

let photosData = [{
  id: 183, 
  PlayerId: 195, 
  location: "photos/biddy.png", 
  captionerId: 194,
  caption: "rolly polly?", 
  votes: 2
}, {
  PlayerId: 194,
  caption: "faux panda",
  id: 182,
  captionerId: 195,
  location: "photos/we-rate-dogs.jpg",
  votes: 0
}];

let photosData2 = [{
  id: 200, 
  PlayerId: 100, 
  location: "photos/biddy.png", 
  captionerId: 101,
  caption: "rolly polly?", 
  votes: 3
}, {
  PlayerId: 101,
  caption: "faux panda",
  id: 201,
  captionerId: 102,
  location: "photos/we-rate-dogs.jpg",
  votes: 0
}, {
  PlayerId: 102,
  caption: "faux panda",
  id: 202,
  captionerId: 100,
  location: "photos/we-rate-dogs.jpg",
  votes: 0
}];

describe("createPlayersArray", function() {
  it("returns an array with all PlayerIds for the round", function() {
    chai.expect(createPlayersArray(photosData)).to.deep.equal({players: [195, 194]});
  });

  it("returns an empty array if no data", function() {
    chai.expect(createPlayersArray([])).to.deep.equal({players: []});
  });
});

let newProp = {players: [2342, 5232, 12315, 6342]};

describe("resetGameState", function() {
  it("returns an object with all properties of oldState and adds newProp", function() {
    chai.expect(updateGameState(data, newProp)).to.deep.equal({id: 4, round: 5, players: [2342, 5232, 12315, 6342]});
  });
});

describe("calculateScores", function() {
  it("creates an object of scores", function() {
    chai.expect(calculateScores(photosData)).to.deep.equal({scores: {195: 200, 194: 300}});
  });

  it("tabulates scores, leaving out ones with 0", function() {
    chai.expect(calculateScores(photosData2)).to.deep.equal({scores: {100: 300, 101: 450}});
  });
});