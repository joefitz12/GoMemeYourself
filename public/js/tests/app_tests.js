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
    chai.expect(setGameState(data)).to.deep.equal({id: 4, round: 6});
  });
});

let newProp = [2342, 5232, 12315, 6342];

describe("setGameState", function() {
  it("returns an object with all properties of oldState and adds newProp", function() {
    chai.expect(updateGameState(data, newProp)).to.deep.equal({id: 4, round: 5, players: [2342, 5232, 12315, 6342]});
  });
});