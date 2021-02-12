const request = require('supertest');
const app = require('../../app');


let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU3ZGM1ZTYwNWU1NDcwYzIxMmE0ZjQzIn0sImlhdCI6MTU4NTgxNTY3MiwiZXhwIjoxNTg2MTc1NjcyfQ.fEC7Kkbe9rHGOIFsqjuGGsLTpuJ5ebDii0tU8VVCFu4";

beforeAll((done) => {
    request(app)
        .post('/auth')
        .send({
            email:'yanga@thedigitalacademy.co.za',
            password: '123456l@'
        })
        .end((err, response) => {
            token = response.body.token; // save the token!
            done();
        });// 
})

describe('Testing community endpoints', () => {


    /* get all community posts */
    it('should test get all community posts ', async () => {
        const response = await request(app).get('/community')
            .send()
        expect(response.status).toBe(200);
 
    })

    /* create or update community post test  */
    it('should test create/update community posts', async () => {

        const response = await request(app)
            .post('/community')
            .set('x-auth-token', `${token}`)
            .send({
                user: '5e7dc5e605e5470c212a4f43',
                title: 'angular',
                content: 'angular is relevant',
                image: ' ',
                tags: 'Angular',
                comments: 'commented',
                datePosted: '2020/04/01'
            })
                expect(response.type).toBe('application/json');
            
    })
});