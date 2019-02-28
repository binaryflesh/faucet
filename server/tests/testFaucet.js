import chai from 'chai'
import chaiHttp from 'chai-http'
import mockedEnv from 'mocked-env'
import Faucet from '../models/faucet'
// import decache from 'decache'

chai.use(chaiHttp)

let app = require('../server').default

const { expect } = chai
let restore

describe('Test Faucet server requests', () => {
    before(() => {
        restore = mockedEnv({
            ADDRESS: '0x00bd138abd70e2f00903268f3db08f2d25677c9e',
            NODE_ENV: 'test'
        })
    })

    beforeEach(() => {
        Faucet.deleteMany({}, () => {})
    })

    it('should not POST without an address', done => {
        let req = {
            address: ''
        }
        chai.request(app)
            .post('/faucet')
            .send(req)
            .end((err, res) => {
                expect(err).to.equal(null)
                expect(res).to.have.status(400)
                expect(res.body).not.equal(null)
                expect(res.body.errors).not.equal(null)
                expect(res.body.errors).to.have.lengthOf.at.least(1)
                expect(res.body.errors[0].msg).to.eql(
                    'Invalid Ethereum address'
                )
                done()
            })
    })

    it('should not POST with an invalid address', done => {
        let req = {
            address: 'invalidaddress'
        }
        chai.request(app)
            .post('/faucet')
            .send(req)
            .end((err, res) => {
                expect(err).to.equal(null)
                expect(res).to.have.status(400)
                expect(res.body).not.equal(null)
                expect(res.body.errors).not.equal(null)
                expect(res.body.errors).to.have.lengthOf.at.least(1)
                expect(res.body.errors[0].msg).to.eql(
                    'Invalid Ethereum address'
                )
                done()
            })
    })

    it('should send 3 ETH', done => {
        let req = {
            address: '0x1F08a98e53b2bDd0E6aE8E1140017e26E935780D'
        }
        chai.request(app)
            .post('/faucet')
            .send(req)
            .end((err, res) => {
                expect(err).to.equal(null)
                expect(res).to.have.status(200)
                expect(res.body).to.not.be.null // eslint-disable-line no-unused-expressions
                expect(res.body.status).to.eql('success')
                expect(res.body.record).to.not.be.null // eslint-disable-line no-unused-expressions
                done()
            })
    })

    it('should not be able to requets tokens in less than 24 hours', done => {
        let req = {
            address: '0x1F08a98e53b2bDd0E6aE8E1140017e26E935780D'
        }
        chai.request(app)
            .post('/faucet')
            .send(req)
            .end((err, res) => {
                expect(err).to.equal(null)
                expect(res.body).not.equal(null)
                expect(res.body.status).to.eql('success')
                expect(res).to.have.status(200)

                chai.request(app)
                    .post('/faucet')
                    .send(req)
                    .end((err, res) => {
                        expect(err).to.equal(null)
                        expect(res.body).not.equal(null)
                        expect(res.body.error).to.include(
                            'Tokens were last transferred to you'
                        )
                        expect(res).to.have.status(500)
                        done()
                    })
            })
    })

    after(() => {
        restore()
    })
})
/*
describe('Test Faucet with empty seed account', () => {
    before(done => {
        Faucet.deleteMany({}, () => {
            restore = mockedEnv({
                ADDRESS: '0x10bd138abd70e2f00903268f3db08f2d25677c9d',
                NODE_ENV: 'test'
            })
            decache('../server')
            app = require('../server').default
            done()
        })
    })

    it('should throw an error as faucet account address does not have enough ETH to transact', done => {
        let req = {
            address: '0x7E187af69973a66e049a15E763c97CB726765f87'
        }
        chai.request(app)
            .post('/faucet')
            .send(req)
            .end(function(err, res) {
                expect(err).to.equal(null)
                expect(res.body).not.equal(null)
                expect(res.body).to.eql(
                    'Faucet server is not available (Seed account does not have enought funds to process the request)'
                )
                expect(res.body.error).to.eql(
                    'Faucet server is not available (Seed account does not have enought funds to process the request)'
                )
                expect(res).to.have.status(500)
                done()
            })
    })
}) */
