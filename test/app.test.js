const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../src/app');

chai.use(chaiHttp);
app.set('testing', true)


describe('GET /results endpoint', () => {
    it('returns results of wins of player and computer', (done) => {

        chai.request(app)
            .get('/results')
            .set('authorization', 'secretpassword')
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
            .set('authorization', 'secretpassword')
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
    app.set('aiHand', 'scissors');

    it('return 400 on invalid player input', (done) => {

        chai.request(app)
            .post('/play')
            .set('authorization', 'secretpassword')
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

        chai.request(app)
            .post('/play')
            .set('authorization', 'secretpassword')
            .send({ "myHand": "rock" })
            .end(function (err, res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                const actual = res.body.message
                expect(actual).to.be.equal(`you played rock, I played scissors, you win`);
                done();
            });
    })

    it('return 204 on player lose', (done) => {

        chai.request(app)
            .post('/play')
            .set('authorization', 'secretpassword')
            .send({ "myHand": "paper" })
            .end(function (err, res) {
                res.should.have.status(204);
                done();
            });
    })

    it('return 418 on tie', (done) => {

        chai.request(app)
            .post('/play')
            .set('authorization', 'secretpassword')
            .send({ "myHand": "scissors" })
            .end(function (err, res) {
                res.should.have.status(418);
                res.body.should.be.a('object');
                const actual = res.body.message
                expect(actual).to.be.equal(`you played scissors, I played scissors, you tie`);
                done();
            });
    })

    it('return 401 with incorrect password on auth header', (done) => {

        chai.request(app)
            .post('/play')
            .set('authorization', 'abcd')
            .send({ "myHand": "rock" })
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                const actual = res.body.message
                expect(actual).to.be.equal(`Not permitted`);
                done();
            });
    })

    it('return 401 without auth header', (done) => {

        chai.request(app)
            .post('/play')
            .send({ "myHand": "rock" })
            .end(function (err, res) {
                res.should.have.status(401);
                res.body.should.be.a('object');
                const actual =  res.body.message
                expect(actual).to.be.equal(`Not permitted`);
                done();
            });
    })

})

