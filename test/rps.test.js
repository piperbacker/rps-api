const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../src/app');
//let aiPlay = require('../src/app').aiPlay;

chai.use(chaiHttp);


describe('GET /results endpoint', () => {
    it('returns results of wins of player and computer', (done) => {

        chai.request(app)
            .get('/results')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('player');
                res.body.should.have.property('computer');
                done();
            });
    })
})

describe('GET /reset endpoint', () => {
    it('AI starts new game', (done) => {

        chai.request(app)
            .get('/reset')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.should.have.status(200);
                res.body.should.be.a('object');
                const actual = res.body.message
                expect(actual).to.be.equal(`AI has started a new game. Use /play endpoint to respond with your move.`);
                done();
            });
    })
})

describe('POST /play endpoint', () => {
    it('return 400 on invalid player input', (done) => {

        chai.request(app)
            .post('/play')
            .send({ "myHand": "1234" })
            .end(function (err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                const actual = res.body.message
                expect(actual).to.be.equal(`Incorrect input. Valid inputs: "rock", "paper", or "scissors".`);
                done();
            });
    })


    it('return 201 on player win', (done) => {

        //let myHand = "rock"
        // aiPlay = "scissors";
        // console.log(`AI PLAY: ${aiPlay}`);

        chai.request(app)
            .post('/play')
            .send({ "myHand": "rock" })
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                //const actual = res.body.message
                //expect(actual).to.be.equal(`you played ${myHand}, I played ${aiPlay}, you ${result}`);
                done();
            });
    })

    /*it('return 204 on player lose', (done) => {

        aiPlay = "scissors";
        //console.log(`AI PLAY: ${aiPlay}`);

        chai.request(app)
            .post('/play')
            .send({ "myHand": "paper" })
            .end(function (err, res) {
                res.should.have.status(204);
                //res.body.should.be.a('object');
                done();
            });
    })

    it('return 418 on tie', (done) => {
        aiPlay = "scissors";
        //console.log(`AI PLAY: ${aiPlay}`);

        chai.request(app)
            .post('/play')
            .send({ "myHand": "scissors" })
            .end(function (err, res) {
                //console.log(res.body.message);
                res.should.have.status(418);
                res.body.should.be.a('object');
                done();
            });
    })*/

})

