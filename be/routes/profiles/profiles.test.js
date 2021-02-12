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

describe('Testing profiles endpoints', () => {

    /* create or update profile test  */
    it('should test create/update user profile', async () => {

        const response = await request(app)
            .post('/profiles')
            .set('x-auth-token', `${token}`)
            .send({
                boi: 'testing is fun but challenging',
                skills: 'angular',
                status: 'pending'
            })
                
                expect(response.type).toBe('application/json');
            
    })

  

      /* get all user profiles route test */
      it('should test to get all user profiles', async () => {
        const response = await request(app).get('/profiles')
        .set('x-auth-token', `${token}`)
        .send()
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
            
 
    })
});