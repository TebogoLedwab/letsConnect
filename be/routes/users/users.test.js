const request = require('supertest');
const app = require('../../app');


describe('Testing users endpoints', () => {

    /* create user post test  */
    it('should test if it can create new user', async () => {

        const response = await request(app)
            .post('/users')
            .send({
                name: 'Yanga Tsele',
                email: 'yanga@thedigitalacademy.co.za',
                password: '123456l@'
            })

        expect(response.type).toBe('application/json');


    })

});