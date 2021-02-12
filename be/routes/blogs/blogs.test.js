const request = require ('supertest');
const app = require('./../../app')

/**
 * simple test the blog.js
 * Use done to notify that it ends
 * Jest test will end when it hits the last line of the test function, 
 * so you need to use a done() to make it right.
 */


let token = "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWU4MjA5ZjEzODE5NDgyNWQ0NWY4M2NkIn0sImlhdCI6MTU4NTgyNDQ0MiwiZXhwIjoxNTg2MTg0NDQyfQ.zBmslUs5wZuYTV6rwyxNl8d0vj6xZd7opq4nDS0iNfU";

beforeAll((done) => {
    request(app)
        .post('/auth')
        .send({
            email:'kedibone@thedigitalacademy.co.za',
            password: '123456l@'
        })
        .end((err, response) => {
            token = response.body.token; // save the token!
            done();
        });// 
})
describe('Testing blog endpoints', () => {


    /* get all blog posts */
    it('should test get all blog posts ', async () => {
        const response = await request(app).get('/blogs')
            .send()
        expect(response.status).toBe(200);
 
    })

    /* create or update blog post test  */
    it('should test create/update blog posts', async () => {

        const response = await request(app)
            .post('/blogs')
            .set('x-auth-token', '${token}')
            .send({
                user: '5e7dc5e605e5470c212a4f43',
                title: 'angular',
                content: 'angular is relevant',
                image: ' ',
                likes: ' ',
                dislikes: ' ',
                datePosted: '2020/04/01'
            })
                // expect(response.status).toBe(200);
                expect(response.type).toBe('application/json');
            
    })




});

