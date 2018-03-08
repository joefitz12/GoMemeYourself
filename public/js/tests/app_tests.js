var expect = require("chai").expect;

function incrementRound(currentRound) {
  return ++currentRound;
}

describe("incrementRound", function() {
  it("increment a number passed by 1", function() {
    expect(incrementRound(3)).to.equal(4);
  });
});