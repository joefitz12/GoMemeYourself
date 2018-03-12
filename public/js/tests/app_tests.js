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
  it("returns an object with two properties", function() {
    chai.expect(setGameState(data)).to.deep.equal({id: 4, round: 6, players: []});
  });
});

let photosData = [{
  id: 1,
  location: "photos/something.jpg", 
  PlayerId: 2
}, {
  id: 2,
  location: "photos/duck.jpg", 
  PlayerId: 3
}, {
  id: 4,
  location: "photos/duck.jpg", 
  PlayerId: 5
}, {
  id: 5,
  location: "photos/duck.jpg", 
  PlayerId: 4
}];

describe("createPlayersArray", function() {
  it("returns an array with all PlayerIds for the round", function() {
    chai.expect(createPlayersArray(photosData)).to.deep.equal([2, 3, 5, 4]);
  });

  it("returns an empty array if no data", function() {
    chai.expect(createPlayersArray([])).to.deep.equal([]);
  });
});

let newProp = [2342, 5232, 12315, 6342];

describe("resetGameState", function() {
  it("returns an object with all properties of oldState and adds newProp", function() {
    chai.expect(updateGameState(data, newProp)).to.deep.equal({id: 4, round: 5, players: [2342, 5232, 12315, 6342]});
  });
});