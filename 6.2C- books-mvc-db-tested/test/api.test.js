const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../server');

describe('Books REST API Endpoints', function() {
    
    // ========================================
    // Tests for GET /api/integrity-check42
    // ========================================
    describe('GET /api/integrity-check42', function() {
        
        // Test 1: Valid behaviour - Should return 204 No Content
        it('should return status 204 No Content', function(done) {
            chai.request(app)
                .get('/api/integrity-check42')
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    done();
                });
        });

        // Test 2: Valid behaviour - Should have empty body
        it('should return empty response body', function(done) {
            chai.request(app)
                .get('/api/integrity-check42')
                .end(function(err, res) {
                    expect(res.text).to.equal('');
                    done();
                });
        });

        // Test 3: Edge case - Multiple requests should all return 204
        it('should consistently return 204 on multiple requests', function(done) {
            chai.request(app)
                .get('/api/integrity-check42')
                .end(function(err, res) {
                    expect(res).to.have.status(204);
                    // Second request
                    chai.request(app)
                        .get('/api/integrity-check42')
                        .end(function(err2, res2) {
                            expect(res2).to.have.status(204);
                            done();
                        });
                });
        });
    });

    // ========================================
    // Tests for invalid routes
    // ========================================
    describe('Invalid Routes', function() {
        
        // Test 4: Non-existing endpoint should return 404
        it('should return 404 for non-existing API endpoint', function(done) {
            chai.request(app)
                .get('/api/nonexistent')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        // Test 5: POST to read-only endpoint should return 404 (not allowed)
        it('should return 404 for POST request to /api/books (read-only API)', function(done) {
            chai.request(app)
                .post('/api/books')
                .send({ title: 'Test Book' })
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        // Test 6: PUT request should return 404
        it('should return 404 for PUT request to /api/books', function(done) {
            chai.request(app)
                .put('/api/books/b1')
                .send({ title: 'Updated Book' })
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        // Test 7: DELETE request should return 404
        it('should return 404 for DELETE request to /api/books', function(done) {
            chai.request(app)
                .delete('/api/books/b1')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });

        // Test 8: Random path should return 404
        it('should return 404 for completely random path', function(done) {
            chai.request(app)
                .get('/random/path/that/does/not/exist')
                .end(function(err, res) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
});
