var schedule = require('node-schedule');
 
const j = schedule.scheduleJob(' 5 * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});


const run =   () => {
    j;
}

module.exports = run;